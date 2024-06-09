package com.anamensis.server.controller;


import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.LoginHistoryResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.entity.Member;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.resultMap.MemberResultMap;
import com.anamensis.server.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.List;


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

        Mono<Member> member = userService.findUserByUserId(user.getUsername(), user.getPassword())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<String> emailVerifyResult = member.flatMap(u -> {
                    if(AuthType.EMAIL.equals(u.getSAuthType())) {
                        EmailVerify emailVerify = new EmailVerify();
                        emailVerify.setEmail(u.getEmail());
                        return emailVerifyService.insert(emailVerify);
                    }
                    return Mono.just("");
                });

        return Mono.zip(member, emailVerifyResult)
                .map(t -> UserResponse.Auth.builder()
                       .authType(t.getT1().getSAuthType())
                       .verity(t.getT1().getSAuth())
                       .build()
                );
    }

    @PublicAPI
    @PostMapping("verify")
    public Mono<UserResponse.Login> verify(
            @RequestBody UserRequest.Login user,
            Device device
    ) {

        Mono<MemberResultMap> member = userService.findUserInfo(user.getUsername())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<Token> token = member.flatMap(u -> generateToken(u.getMember().getUserId()))
                .subscribeOn(Schedulers.boundedElastic());

        member.flatMap(u -> loginHistoryService.save(device, u.getMember()))
                .subscribeOn(Schedulers.boundedElastic())
                .subscribe();

        if(AuthType.OTP.equals(user.getAuthType().toUpperCase())) {
            return otpLogin(user.getCode().toString(), member, token);
        } else if(AuthType.EMAIL.equals(user.getAuthType().toUpperCase())) {
            return emailLogin(user.getCode().toString(), member, token);
        }
        return notAuth(member, token);
    }


    @PublicAPI
    @PostMapping("signup")
    public Mono<UserResponse.Status> signup(
            @Valid @RequestBody
            UserRequest.Register user
    ) {
        return userService.saveUser(user)
                .flatMap(u -> attendanceService.init(u.getId()))
                .then(Mono.fromCallable(() -> UserResponse.Status
                          .transToStatus(HttpStatus.CREATED, "User created"))
                );
    }

    @PublicAPI
    @PostMapping("exists")
    public Mono<UserResponse.Status> exists(
            @Valid @RequestBody UserRequest.existsMember data
    ) {

        return userService.existsUser(data)
               .map(exists -> UserResponse.Status
                       .transToStatus(HttpStatus.OK, exists.toString())
               );
    }

    @GetMapping("histories")
    public Mono<PageResponse<LoginHistoryResponse.LoginHistory>> histories(
            Page page,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Mono<Member> member = userService.findUserByUserId(userDetails.getUsername())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<Integer> count = member.flatMap(u -> loginHistoryService.count(u.getId()))
                .subscribeOn(Schedulers.boundedElastic());

        Mono<List<LoginHistoryResponse.LoginHistory>> content = member
                .flatMapMany(t -> loginHistoryService.selectAll(t, page))
                .map(LoginHistoryResponse.LoginHistory::from)
                .collectList()
                .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(content, count)
                .map(t -> {
                    page.setTotal(t.getT2());
                    return new PageResponse<>(page , t.getT1());
                });
    }

    @GetMapping("refresh")
    public Mono<Boolean> refresh(
    ) {
        return Mono.just(true);
    }

    @GetMapping("profile-img")
    public Mono<String> profileImg(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
                .flatMap(user -> fileService.findByTableNameAndTableRefPk("member", user.getId()))
                .map(file ->
                    file.isEmpty() ? ""
                                   : file.get(0).getFilePath() + file.get(0).getFileName()
                );
    }

    @GetMapping("info")
    public Mono<UserResponse.MyPage> info(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
                .flatMap(u -> Mono.just(UserResponse.MyPage.transToMyPage(u)));
    }

    @PutMapping("info")
    public Mono<UserResponse.Status> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserRequest.Profile profile
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
                .doOnNext(user -> {
                    user.setName(profile.getName());
                    user.setEmail(profile.getEmail());
                    user.setPhone(profile.getPhone());
                    user.setUpdateAt(LocalDateTime.now());
                })
                .flatMap(userService::updateUser)
                .map(result -> {
                    HttpStatus status = result ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
                    String message = result ? "Success" : "Failed";
                    return UserResponse.Status.transToStatus(status, message);
                });
    }

    @PutMapping("s-auth")
    public Mono<UserResponse.Status> sAuth(
            @RequestBody UserRequest.SAuth auth,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
                .flatMap(u -> userService.editAuth(u.getId(), auth.isSauth(), AuthType.fromString(auth.getSauthType())))
                .flatMap(result -> {
                    HttpStatus status = result ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
                    String message = result ? "Success" : "Failed";
                    return Mono.just(UserResponse.Status.transToStatus(status, message));
                });

    }

    private Mono<UserResponse.Login> notAuth(
            Mono<MemberResultMap> member,
            Mono<Token> token
    ){
        return Mono.zip(member, token)
                .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT2()));
    }

    private Mono<UserResponse.Login> emailLogin(
            String code,
            Mono<MemberResultMap> member,
            Mono<Token> token
    ) {
        Mono<Boolean> update = member.flatMap(m -> {
            EmailVerify emailVerify = new EmailVerify();
            emailVerify.setEmail(m.getMember().getEmail());
            emailVerify.setCode(code);
            emailVerify.setExpireAt(LocalDateTime.now());

            return emailVerifyService.updateIsUse(emailVerify);
        })
        .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(member, update, token)
                .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT3()));
    }

    private Mono<UserResponse.Login> otpLogin(
            String code,
            Mono<MemberResultMap> member,
            Mono<Token> token
    ) {
        Mono<Boolean> update = member
                .flatMap(u -> otpService.selectByMemberPk(u.getMemberPk()))
                .flatMap(otpResult -> otpService.verify(otpResult.getHash(), Integer.parseInt(code)))
                .flatMap(result -> {
                    if (!result) return  Mono.error(new RuntimeException("OTP code is invalid"));
                    return Mono.just(true);
                })
                .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(member, update, token)
                .map(t -> UserResponse.Login.transToLogin(t.getT1(), t.getT3()));
    }

    private Mono<Token> generateToken(String userId) {
        Token token = Token.builder()
                .accessToken(tokenProvider.generateToken(userId, false))
                .refreshToken(tokenProvider.generateToken(userId, true))
                .accessTokenExpiresIn(tokenProvider.ACCESS_EXP)
                .refreshTokenExpiresIn(tokenProvider.REFRESH_EXP)
                .build();
        return Mono.just(token);
    }
}
