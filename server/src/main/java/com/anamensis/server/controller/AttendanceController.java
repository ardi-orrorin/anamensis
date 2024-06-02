package com.anamensis.server.controller;

import com.anamensis.server.dto.response.AttendResponse;
import com.anamensis.server.entity.Attendance;
import com.anamensis.server.entity.Member;
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
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    private final PointService pointService;

    private final UserService userService;

    @GetMapping("")
    public Mono<AttendResponse.AttendInfo> info(
        @AuthenticationPrincipal UserDetails user
    ) {
        AtomicReference<Member> memberAtomic = new AtomicReference<>();
        return userService.findUserByUserId(user.getUsername())
                .doOnNext(memberAtomic::set)
                .flatMap(u -> attendanceService.findByMemberPk(u.getId())
                )
                .flatMap(attend ->
                    Mono.just(AttendResponse.AttendInfo.mergeUserAndAttendance(memberAtomic.get(), attend))
                );
    }


    @GetMapping("check")
    public Mono<String> update(
            @AuthenticationPrincipal UserDetails user
    ) {
        AtomicReference<Member> memberAtomic = new AtomicReference<>();
        return userService.findUserByUserId(user.getUsername())
                .doOnNext(memberAtomic::set)
                .flatMap(u -> attendanceService.update(u.getId()))
                .flatMap(attend -> {
                    String seq = attend.getDays() > 10
                        ? "10"
                        : String.valueOf(attend.getDays());
                    return pointService.selectByIdOrName(seq);
                })
                .flatMap(pointCode -> userService.updatePoint(memberAtomic.get().getId(), (int) pointCode.getPoint()))
                .onErrorReturn(false)
                .map(result ->  result ? "success" : "fail");
    }
}
