package com.anamensis.server.controller;

import com.anamensis.server.entity.Attendance;
import com.anamensis.server.service.AttendanceService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    private final UserService userService;

    @GetMapping("check")
    public Mono<String> update(Mono<UserDetails> user) {
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .publishOn(Schedulers.boundedElastic())
                .map(u -> attendanceService.update(u.getId()));
    }

    @GetMapping("")
    public Mono<Attendance> findByUserPk(Mono<UserDetails> user) {
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .publishOn(Schedulers.boundedElastic())
                .map(u -> attendanceService.findByUserPk(u.getId()));
    }

}
