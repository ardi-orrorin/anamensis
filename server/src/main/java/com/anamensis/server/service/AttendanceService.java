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
            return this.init(userPk)
                    .then(Mono.defer(() ->
                            Mono.justOrEmpty(attendanceMapper.findByUserPk(userPk))
                        )
                    );
        }

        return Mono.justOrEmpty(attendance);
    }

    @Transactional
    public Mono<Void> init(long userPk) {
        attendanceMapper.init(userPk, LocalDate.now());
        return Mono.empty();
    }


    @Transactional
    public Mono<Attendance> update(long userPk) {
        return Mono.just(userPk)
                   .flatMap(this::findByUserPk)
                   .doOnNext(this::updateAttendance)
                   .doOnNext(attendanceMapper::update);
    }


    private Mono<Void> updateAttendance(Attendance attendance) {
        if (attendance.getLastDate().isEqual(LocalDate.now())) {
            throw new RuntimeException("오늘은 이미 출석 했습니다.");
        }

        if (attendance.getLastDate().plusDays(1).isEqual(LocalDate.now())) {
            attendance.setDays(attendance.getDays() + 1);
        } else {
            attendance.setDays(1);
        }

        attendance.setLastDate(LocalDate.now());
        return Mono.empty();
    }
}
