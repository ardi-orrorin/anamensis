package com.anamensis.server.service;

import com.anamensis.server.dto.FileHashRecord;
import com.anamensis.server.dto.FilePathDto;
import com.anamensis.server.dto.request.FileRequest;
import com.anamensis.server.entity.File;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.TableCode;
import com.anamensis.server.mapper.FileMapper;
import com.anamensis.server.mapper.TableCodeMapper;
import com.anamensis.server.provider.AwsS3Provider;
import com.anamensis.server.provider.FilePathProvider;
import com.anamensis.server.provider.FileProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FilePartEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

    private final FileProvider fileProvider;

    private final FileMapper fileMapper;

    private final FilePathProvider filePathProvider;

    private final AwsS3Provider awsS3Provider;

    private final TableCodeMapper tableCodeMapper;

    @Value("${file.storage.dir}")
    private String UPLOAD_DIR;

    private final Sinks.Many<FileHashRecord> list = Sinks.many().multicast().directAllOrNothing();

    public File selectByFileName(String fileName) {
        return fileMapper.selectByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public Mono<List<File>> findByTableNameAndTableRefPk(String tableName, long tableRefPk) {
        return Mono.just(fileMapper.findByTableNameAndTableRefPk(tableName, tableRefPk));
    }

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


    public Mono<File> insert(FilePart filePart, FileRequest.Upload fileContent) {
        FilePathDto filepath = filePathProvider.getBoardContent(filePart.filename());

        File fileEntity = new File();
        fileEntity.setTableCodePk(fileContent.tableCodePk());
        fileEntity.setFilePath(filepath.filepath());
        fileEntity.setFileName(filepath.filename());
        fileEntity.setOrgFileName(filePart.filename());
        fileEntity.setCreateAt(LocalDateTime.now());
        fileEntity.setUse(true);

        int reuslt = fileMapper.insert(fileEntity);

        if(reuslt == 0) {
            return Mono.error(new RuntimeException("File insert failed"));
        }

        if(!"image".equalsIgnoreCase(filePart.headers().getContentType().getType())) {
            return Mono.just(fileEntity);
        }

        String filename = filepath.filename().substring(0, filepath.filename().lastIndexOf("."))
            + "_thumb"
            + filepath.filename().substring(filepath.filename().lastIndexOf("."));

        Mono<Boolean> thumbnail;

        switch ((int) fileContent.categoryPk()) {
            case 4 -> thumbnail = awsS3Provider.saveAlttuelThumbnail(filePart, filepath.filepath(), filename);
            case 5 -> thumbnail = awsS3Provider.saveAlbumThumbnail(filePart, filepath.filepath(), filename);
            default -> thumbnail = awsS3Provider.saveThumbnail(filePart, filepath.filepath(), filename);
        }


        Mono<Boolean> ori = awsS3Provider.saveOriginal(filePart, filepath.filepath(), filepath.filename());

        return Mono.zip(thumbnail, ori)
            .subscribeOn(Schedulers.boundedElastic())
            .map(r -> fileEntity);
    }

    public Mono<String> saveProfile(Member users, FilePart filePart) {
        FilePathDto filepath = filePathProvider.getProfile(
                String.valueOf(users.getId()),
                filePart.filename()
        );

        File fileEntity = new File();
        fileEntity.setFileName(filepath.filename());
        fileEntity.setFilePath(filepath.filepath());
        fileEntity.setOrgFileName(filePart.filename());
        fileEntity.setTableCodePk(1);
        fileEntity.setTableRefPk(users.getId());
        fileEntity.setCreateAt(LocalDateTime.now());
        fileEntity.setUse(true);

        return Mono.just(fileMapper.findByTableNameAndTableRefPk("user", users.getId()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(file -> {
                    if(!file.isEmpty()) { // 이미 파일이 있는 경우 삭제
                        fileMapper.updateIsUseById(file.get(0).getId(), 0);
                        awsS3Provider.deleteS3(file.get(0).getFilePath(), file.get(0).getFileName())
                                .subscribe();
                    }
                })
                .doOnNext($ -> fileMapper.insert(fileEntity))
                .flatMap(r -> awsS3Provider.saveProfileThumbnail(filePart, filepath.filepath(), filepath.filename()))
                .then(Mono.defer(() -> Mono.just(filepath.filepath() + filepath.filename())));
    }


    public Mono<Boolean> deleteFile(File file) {
        return Mono.just(fileMapper.updateIsUseById(file.getId(), 0))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(r -> {
                    awsS3Provider.aws3ImgDelete(file.getFilePath(), file.getFileName());
                })
                .map(this::response);
    }

    public Mono<Boolean> updateByTableRefPk(long[] ids, String tableName, long boardPk) {
        Optional<TableCode> tableCode = tableCodeMapper.findByIdByTableName(0, tableName);
        if(tableCode.isEmpty()) {
            return Mono.just(false);
        }

        return Mono.fromCallable(() -> fileMapper.updateByTableRefPk(ids, boardPk, tableCode.get().getId()) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> deleteByPks(long[] ids) {
        List<File> files = fileMapper.findByIds(ids);

        if(files.isEmpty()) {
            return Mono.just(false);
        } else {
            files.forEach(file -> awsS3Provider.aws3ImgDelete(file.getFilePath(), file.getFileName()));
        }

        return Mono.fromCallable(()-> fileMapper.deleteByIds(ids) > 0)
            .onErrorReturn(false);
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

    public Mono<Boolean> deleteByUri(String fileUri) {

        String filePath = fileUri.substring(0, fileUri.lastIndexOf("/") + 1);
        String fileName = fileUri.substring(fileUri.lastIndexOf("/") + 1);

        return Mono.just(fileMapper.deleteByUri(filePath, fileName) > 0)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(r -> {

                    awsS3Provider.aws3ImgDelete(filePath, fileName);
                });
    }

}



