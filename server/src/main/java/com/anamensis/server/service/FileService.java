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
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.awt.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    public Mono<List<File>> insert(FilePart filePart, File fileContent) {
        return fileProvider.save(filePart, fileContent)
                .flatMapMany(file -> saveBoardImg(filePart, file))
                .doOnNext(t -> fileMapper.insert(t.getT1()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(t -> {
                    if (t.getT2().width() == 0 || t.getT2().height() == 0) {
                        awsS3Provider.saveOri(filePart, t.getT2().path(), t.getT2().file())
                                .subscribe();
                    } else {
                        awsS3Provider.saveThumbnail(filePart, t.getT2().path(), t.getT2().file(), t.getT2().width(), t.getT2().height())
                                .subscribe();
                    }
                })
                .map(Tuple2::getT1)
                .collectList()
                .onErrorMap(RuntimeException::new);
    }

    public Flux<Tuple2<File, FilePathDto>> saveBoardImg(FilePart filePart, File fileContent) {
        int profileWidth = 700;
        int profileHeight = 700;

        String ext = filePart.filename().substring(filePart.filename().lastIndexOf(".") + 1);

        List<FilePathDto> filepath = filePathProvider.changeContentPath(
                String.valueOf(fileContent.getTableCodePk()),
                String.valueOf(fileContent.getTableRefPk()),
                profileWidth, profileHeight, ext
        );

        return Flux.fromIterable(filepath)
            .map(file -> {
                File newFile = File.builder()
                    .tableCodePk(fileContent.getTableCodePk())
                    .tableRefPk(fileContent.getTableRefPk())
                    .fileName(file.file())
                    .filePath(file.path())
                    .orgFileName(filePart.filename())
                    .createAt(LocalDateTime.now())
                    .isUse(true)
                    .build();
                return Tuples.of(newFile, file);
            });

    }

    public Mono<List<File>> findByTableNameAndTableRefPk(String tableName, long tableRefPk) {
        return Mono.just(fileMapper.findByTableNameAndTableRefPk(tableName, tableRefPk));
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

        FilePathDto filepath = filePathProvider.changeUserPath(
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
                .isUse(true)
                .build();

        return Mono.just(fileMapper.findByTableNameAndTableRefPk("user", user.getId()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(file -> {
                    if(!file.isEmpty()) { // 이미 파일이 있는 경우 삭제
                        fileMapper.updateIsUseById(file.get(0).getId(), 0);
                        awsS3Provider.deleteS3(file.get(0).getFilePath(), file.get(0).getFileName())
                                .subscribe();
                    }
                })
                .doOnNext($ -> fileMapper.insert(fileEntity))
                .flatMap(r -> awsS3Provider.saveProfileThumbnail(filePart, filepath.path(), filepath.file(), profileWidth, profileHeight))
                .then(Mono.defer(() -> Mono.just(filepath.path() + filepath.file())));
    }

}



