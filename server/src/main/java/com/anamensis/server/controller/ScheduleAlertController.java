package com.anamensis.server.controller;

import com.anamensis.server.entity.ScheduleAlert;
import com.anamensis.server.service.ScheduleAlertService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/schedule-alert")
public class ScheduleAlertController {

    private final ScheduleAlertService scheduleAlertService;
    private final UserService userService;

    @GetMapping("")
    public Mono<List<ScheduleAlert>> findAllByUserId(
        @AuthenticationPrincipal UserDetails user

    ) {
        return scheduleAlertService.findAllByUserId(user.getUsername())
            .collectList();
    }
}
