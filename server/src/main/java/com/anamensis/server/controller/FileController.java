package com.anamensis.server.controller;

import com.anamensis.server.dto.FileHashRecord;
import com.anamensis.server.entity.File;
import com.anamensis.server.provider.FileProvider;
import com.anamensis.server.service.FileService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    private final UserService userService;

    @PostMapping("content-img")
    public Mono<File> upload(
            @RequestPart("file") FilePart filePart,
            @RequestPart("fileContent") File fileContent
    ) {
        return Mono.just(filePart)
                .doOnNext(part -> {
                    if(!part.headers().getContentType().getType().equalsIgnoreCase("image")){
                        throw new RuntimeException("Invalid file type");
                    }
                })
                .flatMap($-> fileService.insert(filePart, fileContent));
    }

    @GetMapping("/{fileName}")
    public Mono<File> download(@PathVariable Mono<String> fileName) {
        return fileName.map(fileService::selectByFileName)
                .onErrorMap(RuntimeException::new);
    }

    @PostMapping("profile")
    public Mono<String> saveProfile(
        @RequestPart(name = "file") FilePart filePart,
        @AuthenticationPrincipal Mono<UserDetails> userDetails
    ) {
        return userDetails
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(user -> fileService.saveProfile(user, filePart));
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
                .onErrorComplete(e->
                    fileService.deleteFile(hash)
                );

    }
}
