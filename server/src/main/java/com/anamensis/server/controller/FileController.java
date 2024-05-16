package com.anamensis.server.controller;

import com.anamensis.server.entity.File;
import com.anamensis.server.service.FileService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    private final UserService userService;

    @PostMapping("content")
    public Mono<List<File>> upload(
            @RequestPart("file") FilePart filePart,
            @RequestPart("fileContent") File fileContent
    ) {
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
        @AuthenticationPrincipal Mono<UserDetails> userDetails
    ) {
        return userDetails
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(user -> fileService.saveProfile(user, filePart));
    }
}
