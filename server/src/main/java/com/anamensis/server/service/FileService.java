package com.anamensis.server.service;

import com.anamensis.server.dto.FilePathDto;
import com.anamensis.server.entity.File;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.FileMapper;
import com.anamensis.server.provider.AwsS3Provider;
import com.anamensis.server.provider.FilePathProvider;
import com.anamensis.server.provider.FileProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileProvider fileProvider;

    private final FileMapper fileMapper;

    private final FilePathProvider filePathProvider;

    private final AwsS3Provider awsS3Provider;


    public File selectByFileName(String fileName) {
        return fileMapper.selectByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Transactional
    public Mono<Boolean> insert(FilePart filePart, File file) {
        return fileProvider.save(filePart, file)
                .map(fileMapper::insert)
                .map(this::response)
                .onErrorMap(RuntimeException::new);
    }

    public Mono<File> findByTableNameAndTableRefPk(String tableName, long tableRefPk) {
        return Mono.justOrEmpty(fileMapper.findByTableNameAndTableRefPk(tableName, tableRefPk));
    }


    private boolean response(int result) {
        if (result == 0) {
            throw new RuntimeException("File insert failed");
        }
        return true;
    }


    @Transactional
    public Mono<String> saveProfile(User user, FilePart filePart) {

        int profileWidth = 150;
        int profileHeight = 150;

        String ext = filePart.filename().substring(filePart.filename().lastIndexOf(".") + 1);

        FilePathDto filepath = filePathProvider.changePath(
                FilePathProvider.RootType.PROFILE,
                String.valueOf(user.getId()),
                profileWidth,profileHeight, ext
        );

        File fileEntity = File.builder()
                .fileName(filepath.file())
                .filePath(filepath.path())
                .orgFileName(filePart.filename())
                .tableCodePk(1)
                .tableRefPk(user.getId())
                .createAt(LocalDateTime.now())
                .build();

        return this.findByTableNameAndTableRefPk("user", user.getId())
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(file -> {
                    if(file != null) { // 이미 파일이 있는 경우 삭제
                        fileMapper.updateIsUseById(file.getId(), 0);
                        awsS3Provider.deleteS3(file.getFilePath())
                                .subscribe();
                    }
                })
                .doOnNext($ -> fileMapper.insert(fileEntity))
                .flatMap(r -> awsS3Provider.saveS3(filePart, filepath.path(), profileWidth, profileHeight))
                .then(Mono.defer(() -> Mono.just(filepath.path())));
    }

}



