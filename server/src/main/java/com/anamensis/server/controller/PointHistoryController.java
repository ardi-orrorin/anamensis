package com.anamensis.server.controller;

import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.entity.User;
import com.anamensis.server.service.PointHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/point-histories")
public class PointHistoryController {
    private final PointHistoryService pointHistoryService;
    private final UserService userService;

    @GetMapping("")
    public Mono<List<PointHistory>> getPointHistories(
            Mono<PointHistory> pointHistory,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return pointHistory
                .zipWith(user)
                .doOnNext(this::transUserDetailToUserPk)
                .map(tuple -> pointHistoryService.selectByPointHistory(tuple.getT1()));
    }

    @PostMapping("")
    public Mono<Boolean> postPointHistory(
            Mono<PointHistory> pointHistory,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return pointHistory
                .zipWith(user)
                .doOnNext(this::transUserDetailToUserPk)
                .publishOn(Schedulers.boundedElastic())
                .map(tuple -> pointHistoryService.insert(tuple.getT1()));
    }

    private void transUserDetailToUserPk(Tuple2<PointHistory, UserDetails> tuple) {
        long userPk = userService.findUserByUserId(
                tuple.getT2().getUsername()
        ).getId();

        tuple.getT1().setUserPk(userPk);
    }
}
