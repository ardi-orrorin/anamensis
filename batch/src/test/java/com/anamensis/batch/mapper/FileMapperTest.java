package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.File;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class FileMapperTest {

    @SpyBean
    FileMapper fileMapper;

    Logger log = LoggerFactory.getLogger(FileMapperTest.class);

    @Test
    void selectDummyFile() {
        LocalDate to = LocalDate.now().minusDays(2);
        LocalDate from = to.minusDays(5);
        List<File> list = fileMapper.selectDummyFile(from, to);
        log.info("list size: {}", list.size());
        list.forEach(f -> log.info(f.toString()));
    }

    @Test
    @Transactional
    void deleteDummyFile() {
        LocalDate to = LocalDate.now().minusDays(2);
        LocalDate from = to.minusDays(1);
        List<File> list = fileMapper.selectDummyFile(from, to);

        List<Long> ids = list.stream().map(File::id).toList();

//        log.info("ids: {}", ids);
//        int result = fileMapper.deleteDummyFile(ids);

    }
}