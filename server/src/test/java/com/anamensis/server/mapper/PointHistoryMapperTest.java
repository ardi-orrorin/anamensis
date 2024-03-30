package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointHistory;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PointHistoryMapperTest {

    @SpyBean
    PointHistoryMapper pointHistoryMapper;

    Logger log = LoggerFactory.getLogger(PointHistoryMapperTest.class);

    @Test
    void insert() {
        PointHistory pointHistory = PointHistory.builder()
                .tableName("point")
                .tablePk(1)
                .userPk(2)
                .pointCodePk(1)
                .createAt(LocalDateTime.now())
                .build();
        pointHistoryMapper.insert(pointHistory);
    }

    @Test
    void selectByPointHistory() {
        PointHistory pointHistory = PointHistory.builder()
//                .tableName("point")
//                .tablePk(1)
                .userPk(2)
//                .pointCodePk(1)
//                .createAt(LocalDateTime.now())
                .build();

        pointHistoryMapper.selectByPointHistory(pointHistory)
                .forEach(e -> log.info("{}",e));


    }
}