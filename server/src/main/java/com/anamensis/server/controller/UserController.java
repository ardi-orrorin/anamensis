package com.anamensis.server.controller;


import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.LoginHistoryResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.AttendanceService;
import com.anamensis.server.service.LoginHistoryService;
import com.anamensis.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;
    private final AttendanceService attendanceService;
    private final LoginHistoryService loginHistoryService;
    private final TokenProvider tokenProvider;

    @PostMapping("login")
    public Mono<UserResponse.Login> login(
            @RequestBody UserRequest.Login user,
            Device device
    ) {
        return Mono.just(user)
                .flatMap(u -> userService.findUserByUserId(u.getUsername(), u.getPassword()))
                   .flatMap(u -> userService.findUserInfo(u.getUserId()))
                   .zipWith(Mono.just(device))
                   .publishOn(Schedulers.boundedElastic())
                   .doOnNext(u -> loginHistoryService.save(u.getT2(), u.getT1().getUser()))
                   .map(t -> t.mapT2(host -> generateToken(t.getT1().getUser().getUserId())))
                   .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT2()));
    }

    @PostMapping("signup")
    public Mono<UserResponse.Status> signup(@Valid @RequestBody Mono<UserRequest.Register> user) {
        return  userService.saveUser(user)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> attendanceService.init(u.getId()))
                .map(u -> UserResponse.Status
                    .transToStatus(HttpStatus.CREATED, "User created")
                );
    }

    @GetMapping("histories")
    public Mono<PageResponse<LoginHistoryResponse.LoginHistory>> list(
        Page page,
        @AuthenticationPrincipal Mono<UserDetails> userDetails
    ) {
        return userDetails
                .map(user -> userService.findUserByUserId(user.getUsername()))
                .zipWith(Mono.just(page))
                .map(t -> t.mapT2(p -> {
                    p.setTotal(loginHistoryService.count(t.getT1().getId()));
                    return p;
                }))
                .map(t -> t.mapT1(user -> loginHistoryService.selectAll(user, t.getT2())))
                .publishOn(Schedulers.boundedElastic())
                .map(t -> t.mapT1(his ->
                        his.stream().map(LoginHistoryResponse.LoginHistory::from)
                    )
                )
                .publishOn(Schedulers.boundedElastic())
                .map(t -> PageResponse.<LoginHistoryResponse.LoginHistory>builder()
                        .page(t.getT2())
                        .content(t.getT1().toList())
                        .build()
                );
    }


    private Token generateToken(String userId) {
        return Token.builder()
                .accessToken(tokenProvider.generateToken(userId, false))
                .refreshToken(tokenProvider.generateToken(userId, true))
                .build();
    }
}
