package com.anamensis.server.controller;

import com.anamensis.server.dto.response.AttendResponse;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.PointCode;
import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.entity.TableCode;
import com.anamensis.server.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    private final PointService pointService;

    private final PointHistoryService pointHistoryService;

    private final TableCodeService tableCodeService;

    private final UserService userService;

    @GetMapping("")
    public Mono<AttendResponse.AttendInfo> info(
        @AuthenticationPrincipal UserDetails user
    ) {
        return attendanceService.findAttendInfo(user.getUsername());
    }


    @GetMapping("check")
    public Mono<String> update(
            @AuthenticationPrincipal UserDetails user
    ) {
        AtomicReference<Member> memberAtomic = new AtomicReference<>();

        AtomicReference<PointCode> pointCodeAtomic = new AtomicReference<>();

        Mono<TableCode> tableCode = tableCodeService.findByIdByTableName(0, "attendance")
                .subscribeOn(Schedulers.boundedElastic());

        return userService.findUserByUserId(user.getUsername())
                .doOnNext(memberAtomic::set)
                .flatMap(u -> attendanceService.update(u.getId()))
                .flatMap(attend -> {
                    String seq = attend.getDays() > 10
                        ? "10"
                        : String.valueOf(attend.getDays());
                    return pointService.selectByIdOrName(seq);
                })
                .doOnNext(pointCodeAtomic::set)
                .flatMap(pointCode -> userService.updatePoint(memberAtomic.get().getId(), (int) pointCode.getPoint()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(b -> {
                    if(!b) return;
                    attendanceService.addAttendInfoCache(user.getUsername())
                            .subscribe();
                    userService.addUserInfoCache(user.getUsername())
                        .subscribe();
                })
                .doOnNext(isAttend -> {
                    if(!isAttend) return;
                    tableCode.doOnNext(tc -> {
                        PointHistory ph = new PointHistory();
                        ph.setMemberPk(memberAtomic.get().getId());
                        ph.setPointCodePk(pointCodeAtomic.get().getId());
                        ph.setTableRefPk(memberAtomic.get().getId());
                        ph.setTableCodePk(tc.getId());
                        ph.setCreateAt(LocalDateTime.now());
                        pointHistoryService.insert(ph)
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe();
                    })
                    .subscribe();
                })
                .onErrorReturn(false)
                .map(result ->  result ? "success" : "fail");
    }
}
