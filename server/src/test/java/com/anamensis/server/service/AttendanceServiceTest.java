package com.anamensis.server.service;

import com.anamensis.server.entity.Attendance;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AttendanceServiceTest {

    @SpyBean
    private AttendanceService attendanceService;

    Logger log = org.slf4j.LoggerFactory.getLogger(AttendanceServiceTest.class);

    @Test
    void findByUserPk() {
        log.info("attendance: {}", attendanceService.findByUserPk(2));
    }

    @Test
    void init() {
        attendanceService.init(2);
    }

    @Test
    void update() {
        attendanceService.update(1)
                .log().subscribe();
    }

}