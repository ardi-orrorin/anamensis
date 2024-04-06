package com.anamensis.server.service;

import com.anamensis.server.entity.Attendance;
import com.anamensis.server.mapper.AttendanceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    @Transactional
    public Attendance findByUserPk(long userPk) {
        Optional<Attendance> attendance = attendanceMapper.findByUserPk(userPk);

        if(attendance.isEmpty()) {
            this.init(userPk);
            attendance = attendanceMapper.findByUserPk(userPk);
        }

        return attendance.orElseThrow(() ->
                new RuntimeException("Attendance not found")
        );
    }

    @Transactional
    public void init(long userPk) {
        attendanceMapper.init(userPk, LocalDate.now());
    }


    @Transactional
    public String update(long userPk) {
        Attendance attendance = this.findByUserPk(userPk);
        if(attendance.getLastDate().isEqual(LocalDate.now())) {
            return "오늘은 이미 출석 했습니다.";
        }
        attendance.setLastDate(LocalDate.now());
        attendanceMapper.update(attendance);
        return "출석 완료";
    }


}
