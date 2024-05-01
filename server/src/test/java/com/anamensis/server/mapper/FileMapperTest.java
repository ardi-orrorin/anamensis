package com.anamensis.server.mapper;

import com.anamensis.server.entity.File;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FileMapperTest {

    @SpyBean
    FileMapper fileMapper;

    @Test
    void insert() {

        File file = File.builder()
                .orgFileName("test.txt")
                .fileName(UUID.randomUUID() + ".txt")
                .filePath("/20210801/")
                .createAt(LocalDateTime.now())
                .build();

        fileMapper.insert(file);
    }

    @Test
    void selectByFileName() {
//        String fileName = "df.txt"; // 파일이 존재하지 않는 경우
        String fileName = "1186eb78-2c99-4918-bb68-2ec0cb530efd.txt";

        fileMapper.selectByFileName(fileName).orElseThrow(() ->
                new RuntimeException("File not found"));
    }

    @Test
    void updateIsUseById() {
        fileMapper.updateIsUseById(29, 1);
    }
}