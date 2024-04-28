package com.anamensis.server.service;

import com.anamensis.server.entity.Attendance;
import com.anamensis.server.mapper.AttendanceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    @Transactional
    public Mono<Attendance> findByUserPk(long userPk) {
        Optional<Attendance> attendance = attendanceMapper.findByUserPk(userPk);

        if(attendance.isEmpty()) {
            this.init(userPk);
            attendance = attendanceMapper.findByUserPk(userPk);
        }

        return Mono.justOrEmpty(attendance)
                   .switchIfEmpty(Mono.error(
                           new RuntimeException("Not found userPk: " + userPk)
                       )
                   );
    }

    @Transactional
    public void init(long userPk) {
        attendanceMapper.init(userPk, LocalDate.now());
    }


    @Transactional
    public Mono<Attendance> update(long userPk) {
        return Mono.just(userPk)
                   .map(attendanceMapper::findByUserPk)
                   .map(Optional::get)
                   .doOnNext(attendance -> {
                       if (attendance.getLastDate().isEqual(LocalDate.now())) {
                           throw new RuntimeException("오늘은 이미 출석 했습니다.");
                       }

                       if (attendance.getLastDate().plusDays(1).isEqual(LocalDate.now())) {
                           attendance.setDays(attendance.getDays() + 1);
                       } else {
                           attendance.setDays(1);
                       }

                       attendance.setLastDate(LocalDate.now());
                   })
                   .doOnNext(attendanceMapper::update);
    }
}
