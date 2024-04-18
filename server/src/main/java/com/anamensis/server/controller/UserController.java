package com.anamensis.server.controller;


import com.anamensis.server.dto.*;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.LoginHistoryResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.OTP;
import com.anamensis.server.entity.User;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.AttendanceService;
import com.anamensis.server.service.LoginHistoryService;
import com.anamensis.server.service.OTPService;
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
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.util.Optional;


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;
    private final OTPService otpService;
    private final AttendanceService attendanceService;
    private final LoginHistoryService loginHistoryService;
    private final TokenProvider tokenProvider;

    @PostMapping("login")
    public Mono<UserResponse.Auth> login(
            @RequestBody UserRequest.Login user
    ) {
        return Mono.just(user)
                   .flatMap(u -> userService.findUserByUserId(u.getUsername(), u.getPassword()))
                   .map(u -> UserResponse.Auth.builder()
                           .authType(u.getSAuth() ? AuthType.OTP : AuthType.NONE)
                           .verity(u.getSAuth())
                           .build()
                   );
    }

    @PostMapping("verify")
    public Mono<UserResponse.Login> verify(
            @RequestBody UserRequest.Login user,
            Device device
    ) {

        log.info("verify user: {}", user);

        // todo: auth type 에 따른 분기 처리는 추후에 추가
        if(user.getAuthType().equals(AuthType.OTP.name())) {
            return otpLogin(user, device);
        }

        return notAuth(user, device);
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

    @PostMapping("exists")
    public Mono<UserResponse.Status> exists(@Valid @RequestBody Mono<UserRequest.existsUser> data) {
        return data.flatMap(userService::existsUser)
                .map(exists -> UserResponse.Status
                        .transToStatus(HttpStatus.OK, exists.toString())
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

    @GetMapping("refresh")
    public Mono<Boolean> refresh(
    ) {
        return Mono.just(true);

    }

    private Mono<UserResponse.Login> notAuth(
            UserRequest.Login user,
            Device device
    ){
        return Mono.just(user)
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> userService.findUserInfo(u.getUserId()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> loginHistoryService.save(device, u.getUser()))
                .map(u -> Tuples.of(u, generateToken(u.getUser().getUserId())))
                .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT2()));
    }

    private Mono<UserResponse.Login> otpLogin(UserRequest.Login user,
                                              Device device
    ) {
        return Mono.just(user)
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> transToTuple2(u, otpService.selectByUserPk(u.getId())))
                .map(t -> t.mapT2(m2 -> Tuples.of(m2, user.getCode())))
                .map(t -> t.mapT2(otpService::verify))
                .doOnNext(t -> {
                    if(!t.getT2().getT2()) {
                        throw new RuntimeException("OTP 인증에 실패하였습니다.");
                    }
                })
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> loginHistoryService.save(device, u.getT1()))
                .map(t -> t.mapT2(m2 -> generateToken(t.getT1().getUserId())))
                .map(t -> t.mapT1(m1 -> userService.findUserInfo(m1.getUserId())))
                .publishOn(Schedulers.boundedElastic())
                .flatMap(t ->
                        t.mapT1(t1 -> t1.map(m1 ->  UserResponse.Login.transToLogin(m1, t.getT2())))
                                .getT1()
                );
    }


    private Mono<Tuple2<User, OTP>> transToTuple2(User user, Optional<OTP> otp) {
        OTP otp1 = otp.orElseThrow(() -> new RuntimeException("OTP 정보가 없습니다."));
        return Mono.zip(Mono.just(user), Mono.just(otp1));
    }

    private Token generateToken(String userId) {
        return Token.builder()
                .accessToken(tokenProvider.generateToken(userId, false))
                .refreshToken(tokenProvider.generateToken(userId, true))
                .accessTokenExpiresIn(tokenProvider.ACCESS_EXP)
                .refreshTokenExpiresIn(tokenProvider.REFRESH_EXP)
                .build();
    }
}
