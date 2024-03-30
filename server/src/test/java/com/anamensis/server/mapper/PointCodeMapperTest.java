package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointCode;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PointCodeMapperTest {

    @SpyBean
    PointCodeMapper pointCodeMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(PointCodeMapperTest.class);

    @Test
    void selectAll() {
    }

    @Test
    void selectByIDOrName() {
        PointCode pointCode = PointCode.builder()
//                .id(1)
                .name("test")
                .build();
        pointCodeMapper.selectByIdOrName(pointCode)
                .forEach(System.out::println);
    }

    @Test
    void insert() {
        PointCode pointCode = PointCode.builder()
                .name("test")
                .value(10000)
                .build();

        int result = pointCodeMapper.insert(pointCode);
        assertEquals(1, result);
    }

    @Test
    void update() {
        PointCode pointCode = PointCode.builder()
                .id(1)
                .name("test11")
                .build();

        int result = pointCodeMapper.update(pointCode);
        assertEquals(1, result);


    }
}