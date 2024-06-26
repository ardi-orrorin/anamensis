package com.anamensis.server.controller;

import com.anamensis.server.dto.FileHashRecord;
import com.anamensis.server.dto.request.FileRequest;
import com.anamensis.server.entity.File;
import com.anamensis.server.service.FileService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.datasource.DataSourceException;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FilePartEvent;
import org.springframework.http.codec.multipart.PartEvent;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    private final UserService userService;


    /**
     * 파일 업로드
     * 게시글 이미지 업로드 api
     * @param filePart 파일
     * @param fileContent 파일 내용 FileEntity 사용
     * @return 파일 정보 (fileEntity)
     */
    @PostMapping("content-img")
    public Mono<File> upload(
            @RequestPart("file") FilePart filePart,
            @RequestPart("fileContent") FileRequest.Upload fileContent
    ) {
        if(!filePart.headers().getContentType().getType().equalsIgnoreCase("image")){
            return Mono.error(new RuntimeException("이미지 파일만 업로드 가능합니다."));
        }

        return fileService.insert(filePart, fileContent);
    }

    @GetMapping("/{fileName}")
    public Mono<File> download(@PathVariable Mono<String> fileName) {
        return fileName.map(fileService::selectByFileName)
                .onErrorMap(RuntimeException::new);
    }

    @PostMapping("profile")
    public Mono<String> saveProfile(
        @RequestPart(name = "file") FilePart filePart,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
                .flatMap(user -> fileService.saveProfile(user, filePart));
    }

    @DeleteMapping("profile")
    public Mono<Boolean> deleteProfile(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
                .flatMap(u -> fileService.findByTableNameAndTableRefPk("member", u.getId()))
                .flatMap(files -> fileService.deleteFile(files.get(0)))
                .onErrorReturn(false);
    }

    @PutMapping("delete/filename")
    public Mono<Boolean> deleteFile(
        @RequestBody Map<String, String> body
    ) {
        return fileService.deleteByUri(body.get("fileUri"));
    }

    @PatchMapping("content")
    public Mono<Void> deleteContent(
            @RequestBody Flux<File> files
    ) {
        return files.flatMap(fileService::deleteFile)
                .then();
    }

    @GetMapping("addr")
    public Mono<String> getAddr() {
        return fileService.getAddr();
    }

    @PublicAPI
    @GetMapping(value = "upload/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<FileHashRecord> pushProgress(@PathVariable String id) {
        return fileService.pushProgress(id);

    }

    @PublicAPI
    @PostMapping("upload/{hash}")
    public Mono<File> stream(
            @PathVariable String hash,
            @RequestBody Flux<PartEvent> file,
            @RequestHeader("Content-Length") long length
    ) {
        AtomicInteger input = new AtomicInteger(0);
        AtomicInteger progress = new AtomicInteger(0);

        return file
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(part -> {
                    if(part instanceof FilePartEvent filePartEvent) {
                        fileService.fileUpload(filePartEvent, hash, length, progress, input)
                                .subscribe();
                    }
                })
                .last()
                .flatMap(part -> {
                    if((part instanceof FilePartEvent filePartEvent)) {
                        return fileService.insertFile(filePartEvent, hash);
                    }
                    return Mono.empty();
                })
                .onErrorComplete(e-> {
                    if(e instanceof DataSourceException) {
                        // todo: db 파일 저장 실패
                        log.error("db error", e);
                    }
                    return fileService.deleteFile(hash);
                });
    }
}
