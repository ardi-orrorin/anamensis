package com.anamensis.server.controller;


import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.User;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.AttendanceService;
import com.anamensis.server.service.LoginHistoryService;
import com.anamensis.server.service.UserService;
import io.netty.handler.codec.http.HttpRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.RequestEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.reactive.result.view.RequestContext;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AttendanceService attendanceService;
    private final LoginHistoryService loginHistoryService;
    private final TokenProvider tokenProvider;

    @PostMapping(value = "/login")
    public Mono<String> login(Mono<User> user) throws UnknownHostException {
        return user.flatMap(u -> userService.findUserByUserId(u.username(), u.password()))
                   .zipWith(newLoginHistory(InetAddress.getLocalHost()))
                   .doOnNext(u -> loginHistoryService.save(u.getT2(), u.getT1()))
                   .map(u -> tokenProvider.generateToken(u.getT1().getUserId()));
    }

    @PostMapping("/signup")
    public Mono<String> signup(@Valid @RequestBody com.anamensis.server.entity.User user) {
        return userService.saveUser(Mono.just(user))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> attendanceService.init(u.getId()))
                .map(u -> "success");

    }

    @GetMapping(value = "/test")
    public Mono<String> test(@AuthenticationPrincipal UserDetails user) {
        return Mono.just("test");
    }

    private record User(
        String username,
        String password
    ) {}

    private Mono<LoginHistory> newLoginHistory(InetAddress ip) {
        LoginHistory loginHistory = LoginHistory.builder()
                .ip(ip.getHostAddress())
                .device("chrome") // todo: 수정 예정
                .location("seoul") // todo: 수정 예정
                .build();
        return Mono.just(loginHistory);
    }


}
