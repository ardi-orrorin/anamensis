package com.anamensis.server.service;

import com.anamensis.server.entity.PointCode;
import com.anamensis.server.mapper.PointCodeMapper;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PointServiceTest {

    @SpyBean
    PointService pointService;

    @SpyBean
    PointCodeMapper pointCodeMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(PointServiceTest.class);

    @Test
    void selectAll() {
        pointCodeMapper.selectAll()
                .forEach(System.out::println);
    }

    @Test
    void selectByIDOrNameTest(){
        PointCode pointCode = PointCode.builder()
//                .id(1)
                .name("test")
                .build();
        
        selectByIdOrName(pointCode);

    }

    @Test
    void selectByIdOrName(PointCode pointCode) {
        List<PointCode> result = pointCodeMapper.selectByIdOrName(pointCode);

        log.info("result: {}", result);
    }

    @Test
    void insertTest() {
        PointCode pointCode = PointCode.builder()
                .name("test")
                .value(10000)
                .build();
        insert(pointCode);
    }


    @Test
    void insert(PointCode pointCode) {
        int result = pointCodeMapper.insert(pointCode);

        if(result != 1) new RuntimeException("insert fail");

        log.info("result: {}", result);
    }

}