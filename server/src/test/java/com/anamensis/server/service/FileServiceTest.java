package com.anamensis.server.service;

import com.anamensis.server.entity.File;
import com.anamensis.server.mapper.FileMapper;
import com.anamensis.server.provider.FileProvider;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.webservices.client.AutoConfigureWebServiceClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FileServiceTest {

    @SpyBean
    FileService fileService;

    @SpyBean
    FileProvider fileProvider;

    @SpyBean
    FileMapper fileMapper;

    @Test
    void insert(FilePart filePart, File file) {
        fileProvider.save(filePart, file)
                .map(fileMapper::insert)
                .map(this::response);
    }

    boolean response(int result) {
        if (result == 0) {
            throw new RuntimeException("File insert failed");
        }
        return true;
    }

    @Test
    void findByTableNameAndTableRefPk() {
        fileService.findByTableNameAndTableRefPk("user", 1)
                .log().subscribe();
    }

    @Test
    void deleteFile() {
        File file = File.builder()
                .id(252)
                .fileName("a0b583ea-4849-4470-b5ef-7e180c286619.png")
                .filePath("/resource/board/")
                .build();

        fileService.deleteFile(file)
                .log().subscribe();

    }
}