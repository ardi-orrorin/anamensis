package com.anamensis.server.service;

import com.anamensis.server.dto.FileHashRecord;
import com.anamensis.server.dto.FilePathDto;
import com.anamensis.server.entity.File;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.FileMapper;
import com.anamensis.server.provider.AwsS3Provider;
import com.anamensis.server.provider.FilePathProvider;
import com.anamensis.server.provider.FileProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FilePartEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.Scannable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileProvider fileProvider;

    private final FileMapper fileMapper;

    private final FilePathProvider filePathProvider;

    private final AwsS3Provider awsS3Provider;

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    private final Sinks.Many<FileHashRecord> list = Sinks.many().multicast().directAllOrNothing();

    public File selectByFileName(String fileName) {
        return fileMapper.selectByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public Mono<List<File>> findByTableNameAndTableRefPk(String tableName, long tableRefPk) {
        return Mono.just(fileMapper.findByTableNameAndTableRefPk(tableName, tableRefPk));
    }

    @Transactional
    public Mono<File> insertFile(FilePartEvent filePartEvent, String hash) {
        File newFile = new File();
        newFile.setFileName(filePartEvent.filename());
        newFile.setFilePath(UPLOAD_DIR + hash + "/");
        newFile.setOrgFileName(filePartEvent.filename());
        newFile.setTableCodePk(2);
        newFile.setCreateAt(LocalDateTime.now());

        return Mono.just(newFile)
                .doOnNext(fileMapper::insert);
    }

    @Transactional
    public Mono<File> insert(FilePart filePart, File fileContent) {
        return fileProvider.save(filePart, fileContent)
                .flatMap(file -> saveBoardImg(filePart, file))
                .doOnNext(t -> fileMapper.insert(t.getT1()))
                .publishOn(Schedulers.boundedElastic())
                .flatMap(t -> {
                    if(!"image".equalsIgnoreCase(filePart.headers().getContentType().getType())) {
                           return Mono.just(t) ;
                    }
                    if (t.getT2().width() == 0 || t.getT2().height() == 0) {
                        return awsS3Provider.saveOri(filePart, t.getT2().path(), t.getT2().file())
                                .thenReturn(t);
                    } else {
                        return awsS3Provider.saveThumbnail(filePart, t.getT2().path(), t.getT2().file(), t.getT2().width(), t.getT2().height())
                                .thenReturn(t);
                    }
                })
                .map(Tuple2::getT1)
                .onErrorMap(RuntimeException::new);
    }

    public Mono<Tuple2<File, FilePathDto>> saveBoardImg(FilePart filePart, File fileContent) {
        String ext = filePart.filename().substring(filePart.filename().lastIndexOf(".") + 1);

        FilePathDto filepath = filePathProvider.changeContentPath(0, 0, ext);

        return Mono.just(filepath)
                .map(file -> {
                    File newFile = new File();
                    newFile.setTableCodePk(fileContent.getTableCodePk());
                    newFile.setTableRefPk(fileContent.getTableRefPk());
                    newFile.setFileName(file.file());
                    newFile.setFilePath(file.path());
                    newFile.setOrgFileName(filePart.filename());
                    newFile.setCreateAt(LocalDateTime.now());
                    newFile.setUse(true);

                    return Tuples.of(newFile, file);
                });
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

        File fileEntity = new File();
        fileEntity.setFileName(filepath.file());
        fileEntity.setFilePath(filepath.path());
        fileEntity.setOrgFileName(filePart.filename());
        fileEntity.setTableCodePk(1);
        fileEntity.setTableRefPk(user.getId());
        fileEntity.setCreateAt(LocalDateTime.now());
        fileEntity.setUse(true);

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


    @Transactional
    public Mono<Boolean> deleteFile(File file) {
        return Mono.just(fileMapper.updateIsUseById(file.getId(), 0))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(r -> awsS3Provider.deleteS3(file.getFilePath(), file.getFileName())
                        .subscribe()
                )
                .map(this::response);
    }


    // -----------------------------------------------------------------------------


    public Mono<String> getAddr() {
        String uuid = UUID.randomUUID().toString();

        return Mono.just(new FileHashRecord(uuid, "0"))
                .doOnNext(list::tryEmitNext)
                .flatMap(record -> Mono.just(uuid));
    }

    public Flux<FileHashRecord> pushProgress(String hash) {
        return list
                .asFlux()
                .filterWhen(record -> Mono.just(record.hash().equals(hash)))
                .publish()
                .refCount(1)
                .publishOn(Schedulers.boundedElastic());
    }
    public Mono<Void> fileUpload(
            FilePartEvent filePartEvent,
            String hash,
            long length,
            AtomicInteger progress,
            AtomicInteger input
    ) {
        try {
            fileProvider.saveFile(filePartEvent, input, hash);
            fileProvider.pushProgress(input, length, progress, filePartEvent.content().capacity(), hash, list);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return Mono.empty();
    }

    private boolean response(int result) {
        if (result == 0) {
            throw new RuntimeException("File insert failed");
        }
        return true;
    }

    public boolean deleteFile(String hash) {
        return fileProvider.deleteFile(hash);
    }
}



