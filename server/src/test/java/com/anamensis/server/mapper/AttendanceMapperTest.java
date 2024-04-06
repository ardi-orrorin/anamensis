package com.anamensis.server.mapper;

import com.anamensis.server.entity.Attendance;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AttendanceMapperTest {

    @SpyBean
    private AttendanceMapper attendanceMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(AttendanceMapperTest.class);

    @Test
    void init() {
        attendanceMapper.init(1, LocalDate.now());
    }

    @Test
    void update() {
        Attendance attendance = new Attendance();
        attendance.setUserPk(2);
//        attendance.setLastDate(LocalDate.now().minusDays(1));
        attendance.setLastDate(LocalDate.now());
//        attendance.setDays(3);

        attendanceMapper.update(attendance);
    }

    @Test
    void findByUserPk() {
        Attendance attendance = attendanceMapper.findByUserPk(2)
                        .orElseThrow(() -> new RuntimeException("Attendance not found"));
        log.info("attendance: {}", attendance);
    }
}