package com.anamensis.server.service;

import com.anamensis.server.entity.File;
import com.anamensis.server.mapper.FileMapper;
import com.anamensis.server.provider.FileProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileProvider fileProvider;

    private final FileMapper fileMapper;

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


    private boolean response(int result) {
        if (result == 0) {
            throw new RuntimeException("File insert failed");
        }
        return true;
    }

}
