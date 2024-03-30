package com.anamensis.server.service;

import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.mapper.PointHistoryMapper;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PointHistoryServiceTest {

    @SpyBean
    PointHistoryService pointHistoryService;

    @SpyBean
    PointHistoryMapper pointHistoryMapper;

    Logger log = LoggerFactory.getLogger(PointHistoryServiceTest.class);

    @Test
    void insert(PointHistory pointHistory) {
        int result = pointHistoryMapper.insert(pointHistory);

        if (result != 1 ) throw new RuntimeException("insert 실패");

        log.info("insert 성공");
    }

    @Test
    void insertTest() {
        PointHistory pointHistory = PointHistory.builder()
                .tableName("board")
                .tablePk(4)
                .userPk(2)
                .pointCodePk(1)
                .createAt(LocalDateTime.now())
                .build();

        insert(pointHistory);
    }

    @Test
    void selectByPointHistory(PointHistory pointHistory) {
        pointHistoryMapper.selectByPointHistory(pointHistory)
                .forEach(e -> log.info("{}",e));
    }

    @Test
    void selectByPointHistoryTest() {
        PointHistory pointHistory = PointHistory.builder()
                .userPk(2)
                .build();

        selectByPointHistory(pointHistory);
    }
}