package com.anamensis.server.controller;

import com.anamensis.server.entity.File;
import com.anamensis.server.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("")
    public Mono<Boolean> upload(
            @RequestBody File file,
            @RequestPart("file") FilePart filePart
    ) {
        return fileService.insert(filePart, file);
    }

    @GetMapping("/{fileName}")
    public Mono<File> download(@PathVariable Mono<String> fileName) {
        return fileName.map(name -> fileService.selectByFileName(name))
                .onErrorMap(RuntimeException::new);
    }
}
