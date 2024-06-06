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
@Transactional
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    public Mono<Attendance> findByMemberPk(long memberPk) {
        Optional<Attendance> attend =  attendanceMapper.findByMemberPk(memberPk);
        if(attend.isEmpty()) {
            attendanceMapper.init(memberPk, LocalDate.now()) ;
            attend = attendanceMapper.findByMemberPk(memberPk);
        }

        return Mono.justOrEmpty(attend)
                .switchIfEmpty(Mono.error(new RuntimeException("출석 정보 조회 실패")));
    }

    public Mono<Void> init(long memberPk) {
        return Mono.fromRunnable(() -> attendanceMapper.init(memberPk, LocalDate.now()))
                .onErrorMap(e -> new RuntimeException("출석 정보 초기화 실패"))
                .then();
    }


    public Mono<Attendance> update(long memberPk) {
        return findByMemberPk(memberPk)
                .doOnNext(this::updateAttendance)
                .doOnNext(attendanceMapper::update);
    }


    private void updateAttendance(Attendance attendance) {
        if (attendance.getLastDate().isEqual(LocalDate.now())) {
            throw new RuntimeException("오늘은 이미 출석 했습니다.");
        }

        if (attendance.getLastDate().plusDays(1).isEqual(LocalDate.now())) {
            attendance.setDays(attendance.getDays() + 1);
        } else {
            attendance.setDays(1);
        }

        attendance.setLastDate(LocalDate.now());
    }
}
