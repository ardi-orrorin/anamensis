package com.anamensis.server.controller;


import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
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
import org.springframework.http.HttpStatus;
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
    public Mono<UserResponse.Login> login(Mono<UserRequest.Login> user) throws UnknownHostException {
        return user.flatMap(u -> userService.findUserByUserId(u.getUsername(), u.getPassword()))
                   .flatMap(u -> userService.findUserInfo(u.getUserId()))
                   .zipWith(newLoginHistory(InetAddress.getLocalHost()))
                   .publishOn(Schedulers.boundedElastic())
                   .doOnNext(u -> loginHistoryService.save(u.getT2(), u.getT1().getUser()))
                   .map(u -> u.mapT2(host -> tokenProvider.generateToken(u.getT1().getUser().getUserId())))
                   .map(u -> UserResponse.Login.transToLogin(u.getT1(), u.getT2()));
    }

    @PostMapping("/signup")
    public Mono<UserResponse.Status> signup(@Valid @RequestBody Mono<UserRequest.Register> user) {
        return  userService.saveUser(user)
                .publishOn(Schedulers.boundedElastic())
                .log()
                .doOnNext(u -> attendanceService.init(u.getId()))
                .map(u -> UserResponse.Status
                    .transToStatus(HttpStatus.CREATED, "User created")
                );

    }

    private Mono<LoginHistory> newLoginHistory(InetAddress ip) {
        LoginHistory loginHistory = LoginHistory.builder()
                .ip(ip.getHostAddress())
                .device("chrome") // todo: 수정 예정
                .location("seoul") // todo: 수정 예정
                .build();
        return Mono.just(loginHistory);
    }


}
