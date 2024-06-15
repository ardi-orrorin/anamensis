package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.request.PointHistoryRequest;
import com.anamensis.server.dto.response.PointHistoryResponse;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.PointHistory;
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
    public Mono<PageResponse<PointHistoryResponse.List>> getPointHistories(
            Page page,
            PointHistoryRequest.Param params,
            @AuthenticationPrincipal UserDetails user
    ) {

        Mono<Member> member = userService.findUserByUserId(user.getUsername())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<List<PointHistoryResponse.List>> list = member
                .flatMap(u -> pointHistoryService.selectByPointHistory(params, page, u.getId()))
                .subscribeOn(Schedulers.boundedElastic());


        Mono<Integer> count = member
                .flatMap(u -> pointHistoryService.count(params, u.getId()))
                .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(list, count)
                .map(t -> {
                    page.setTotal(t.getT2());
                    return new PageResponse<>(page, t.getT1());
                });
    }


    @GetMapping("summary")
    public Mono<List<PointHistoryResponse.Summary>> getPointHistoriesSummary(
            Page page,
            @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                .flatMap(u -> pointHistoryService.selectSummary(u.getId(), page));
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
                .flatMap(tuple -> pointHistoryService.insert(tuple.getT1()));
    }

    private Mono<Void> transUserDetailToUserPk(Tuple2<PointHistory, UserDetails> tuple) {
        return userService.findUserByUserId(tuple.getT2().getUsername())
                .doOnNext(u -> tuple.getT1().setMemberPk(u.getId()))
                .then();
    }
}
