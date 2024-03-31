package com.anamensis.server.provider;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.codec.multipart.FilePart;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class FileProviderTest {

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    Logger log = org.slf4j.LoggerFactory.getLogger(FileProviderTest.class);


    @BeforeEach
    void setUp() {
        UPLOAD_DIR = "/Users/yuseungcheol/Downloads/";
    }

    @Test
    void test(FilePart filePart) {
        String filename = "test.txt";
        String ext = filename.substring(filename.lastIndexOf(".") + 1);
        String filename2 = UUID.randomUUID().toString() + "." + ext;
        log.info("filename2: {}", filename2);
        File file = new File(UPLOAD_DIR + filename2);



        try {
            file.createNewFile();
            filePart.transferTo(file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }



}