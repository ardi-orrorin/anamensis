package com.anamensis.server.controller;


import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.LoginHistoryResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.time.LocalDateTime;


@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;
    private final OTPService otpService;
    private final AttendanceService attendanceService;
    private final LoginHistoryService loginHistoryService;
    private final EmailVerifyService emailVerifyService;
    private final TokenProvider tokenProvider;
    private final FileService fileService;

    @PublicAPI
    @PostMapping("login")
    public Mono<UserResponse.Auth> login(
            @RequestBody UserRequest.Login user
    ) {
        return Mono.just(user)
                   .flatMap(u -> userService.findUserByUserId(u.getUsername(), u.getPassword()))
                   .publishOn(Schedulers.boundedElastic())
                   .doOnNext(u -> {
                       if(AuthType.EMAIL.equals(u.getSAuthType())) {
                           EmailVerify emailVerify = new EmailVerify();
                           emailVerify.setEmail(u.getEmail());
                           emailVerifyService.insert(emailVerify)
                                   .subscribe();
                       }
                   })
                   .map(u -> UserResponse.Auth.builder()
                           .authType(u.getSAuthType())
                           .verity(u.getSAuth())
                           .build()
                   );
    }

    @PublicAPI
    @PostMapping("verify")
    public Mono<UserResponse.Login> verify(
            @RequestBody UserRequest.Login user,
            Device device
    ) {
        if(AuthType.OTP.equals(user.getAuthType())) {
            return otpLogin(user, device);
        } else if(AuthType.EMAIL.equals(user.getAuthType())) {
            return emailLogin(user, device);
        }
        return notAuth(user, device);
    }


    @PublicAPI
    @PostMapping("signup")
    public Mono<UserResponse.Status> signup(
            @Valid @RequestBody
            Mono<UserRequest.Register> user
    ) {
        return userService.saveUser(user)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> attendanceService.init(u.getId()))
                .map(u -> UserResponse.Status
                    .transToStatus(HttpStatus.CREATED, "User created")
                );
    }

    @PublicAPI
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
                .flatMap(user -> userService.findUserByUserId(user.getUsername()))
                .zipWith(Mono.just(page))
                .map(t -> t.mapT2(p -> {
                    loginHistoryService.count(t.getT1().getId())
                            .doOnNext(p::setTotal)
                            .subscribe();
                    return p;
                }))
                .publishOn(Schedulers.boundedElastic())
                .map(t -> Tuples.of(loginHistoryService.selectAll(t.getT1(), t.getT2()), t.getT2()))
                .map(t -> t.mapT1(t1 -> t1.map(LoginHistoryResponse.LoginHistory::from).collectList()))
                .publishOn(Schedulers.boundedElastic())
                .flatMap(t -> t.getT1().map(t1 ->
                        PageResponse.<LoginHistoryResponse.LoginHistory>builder()
                        .page(t.getT2())
                        .content(t1)
                        .build())
                );
    }

    @GetMapping("refresh")
    public Mono<Boolean> refresh(
    ) {
        return Mono.just(true);
    }

    @GetMapping("profile-img")
    public Mono<String> profileImg(
            @AuthenticationPrincipal Mono<UserDetails> userDetails
    ) {
        return userDetails
                .flatMap(user -> userService.findUserByUserId(user.getUsername()))
                .flatMap(user -> fileService.findByTableNameAndTableRefPk("user", user.getId()))
                .map(file ->
                    file.isEmpty()
                    ? ""
                    : file.get(0).getFilePath() + file.get(0).getFileName()
                );
    }


    @GetMapping("info")
    public Mono<UserResponse.MyPage> info(
            @AuthenticationPrincipal Mono<UserDetails> userDetails
    ) {
        return userDetails
                .flatMap(user -> userService.findUserByUserId(user.getUsername()))
                .flatMap(u -> Mono.just(UserResponse.MyPage.transToMyPage(u)));
    }

    @PutMapping("info")
    public Mono<UserResponse.Status> update(
            @AuthenticationPrincipal Mono<UserDetails> userDetails,
            @Valid @RequestBody UserRequest.Profile profile
    ) {
        return userDetails
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .doOnNext(user -> {
                    user.setName(profile.getName());
                    user.setEmail(profile.getEmail());
                    user.setPhone(profile.getPhone());
                    user.setUpdateAt(LocalDateTime.now());
                })
                .flatMap(userService::updateUser)
                .map($ -> UserResponse.Status.transToStatus(HttpStatus.OK, "Success"));
    }

    @PutMapping("s-auth")
    public Mono<UserResponse.Status> sAuth(
            @RequestBody UserRequest.SAuth auth,
            @AuthenticationPrincipal Mono<UserDetails> userDetails
    ) {
        return userDetails
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> userService.editAuth(u.getId(), auth.isSauth(), AuthType.fromString(auth.getSauthType())))
                .flatMap($ -> Mono.just(UserResponse.Status.transToStatus(HttpStatus.OK, "Success")));

    }

    private Mono<UserResponse.Login> notAuth(
            UserRequest.Login user,
            Device device
    ){
        return Mono.just(user)
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> userService.findUserInfo(u.getUserId()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> loginHistoryService.save(device, u.getUsers()).subscribe())
                .map(u -> Tuples.of(u, generateToken(u.getUsers().getUserId())))
                .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT2()));
    }

    private Mono<UserResponse.Login> emailLogin(
            UserRequest.Login user,
            Device device
    ) {
        return Mono.just(user)
                .flatMap(u -> userService.findUserInfo(u.getUsername()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> {
                    EmailVerify emailVerify = new EmailVerify();
                    emailVerify.setEmail(u.getUsers().getEmail());
                    emailVerify.setCode(String.valueOf(user.getCode()));
                    emailVerify.setExpireAt(LocalDateTime.now());

                    emailVerifyService.updateIsUse(emailVerify)
                            .subscribe();
                })
                .doOnNext(u -> loginHistoryService.save(device, u.getUsers()).subscribe())
                .publishOn(Schedulers.boundedElastic())
                .map(u -> Tuples.of(u, generateToken(u.getUsers().getUserId())))
                .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT2()));
    }

    private Mono<UserResponse.Login> otpLogin(
            UserRequest.Login user,
            Device device
    ) {
        return Mono.just(user)
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u ->
                    otpService.selectByUserPk(u.getId())
                                    .flatMap(otp -> transToTuple2(u, otp))
                )
                .publishOn(Schedulers.boundedElastic())
                .map(t -> t.mapT2(m2 -> Tuples.of(m2, user.getCode())))
                .map(t -> t.mapT2(otpService::verify))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(t -> {
                    // todo: 다시 체크
                    t.getT2().doOnNext(u -> {
                        if(!u.getT2()) {
                            throw new RuntimeException("OTP 인증에 실패하였습니다.");
                        }
                    }).subscribe();
                })
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> loginHistoryService.save(device, u.getT1()).subscribe())
                .map(t -> t.mapT2(m2 -> generateToken(t.getT1().getUserId())))
                .map(t -> t.mapT1(m1 -> userService.findUserInfo(m1.getUserId())))
                .publishOn(Schedulers.boundedElastic())
                .flatMap(t ->
                        t.mapT1(t1 -> t1.map(m1 ->  UserResponse.Login.transToLogin(m1, t.getT2())))
                                .getT1()
                );
    }


    private Mono<Tuple2<Users, OTP>> transToTuple2(Users users, OTP otp) {
        return Mono.zip(Mono.just(users), Mono.just(otp));
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
