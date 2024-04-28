package com.anamensis.server.controller;

import com.anamensis.server.entity.Attendance;
import com.anamensis.server.entity.PointCode;
import com.anamensis.server.service.AttendanceService;
import com.anamensis.server.service.PointService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.awt.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    private final PointService pointService;

    private final UserService userService;

    @GetMapping("check")
    public Mono<String> update(
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> attendanceService.update(u.getId()))
                .flatMap(this::getPointByAttendance)
                .doOnNext(t -> userService.updatePoint(
                        t.getT1().getUserPk(),
                        (int) t.getT2().getValue()
                ))
                .map(t -> "출석체크 완료");
    }

//    @GetMapping("")
//    public Mono<Attendance> findByUserPk(@AuthenticationPrincipal Mono<UserDetails> user) {
//        return user
//                .map(u -> userService.findUserByUserId(u.getUsername()))
//                .publishOn(Schedulers.boundedElastic())
//                .flatMap(u -> attendanceService.findByUserPk(u.getId()));
//    }


    private Mono<Tuple2<Attendance, PointCode>> getPointByAttendance(Attendance attendance) {
        String name = "attend-" + (
            attendance.getDays() > 10
            ? "10"
            : attendance.getDays()
        );

        return pointService.findByName(name)
                .map(point -> Tuples.of(attendance, point));
    }
}
