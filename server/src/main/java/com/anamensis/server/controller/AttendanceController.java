package com.anamensis.server.controller;

import com.anamensis.server.dto.response.AttendResponse;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    private final PointService pointService;

    private final UserService userService;

    @GetMapping("")
    public Mono<AttendResponse.AttendInfo> info(
        @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> attendanceService.findByMemberPk(u.getId())
                                .map(attend -> Tuples.of(u, attend))
                )
                .flatMap(t ->
                    Mono.just(AttendResponse.AttendInfo.mergeUserAndAttendance(t.getT1(), t.getT2()))
                );
    }


    @GetMapping("check")
    public Mono<String> update(
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> attendanceService.update(u.getId()))
                .flatMap(this::getPointByAttendance)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(t -> userService.updatePoint(
                        t.getT1().getMemberPk(),
                        (int) t.getT2().getPoint()
                    ).subscribe()
                )
                .map(t -> "출석체크 완료");
    }

    private Mono<Tuple2<Attendance, PointCode>> getPointByAttendance(Attendance attendance) {
        String seq = attendance.getDays() > 10  ? "10" : String.valueOf(attendance.getDays());

        return pointService.selectByIdOrName(seq)
                .map(point -> Tuples.of(attendance, point));
    }
}
