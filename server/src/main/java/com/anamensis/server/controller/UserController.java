package com.anamensis.server.controller;


import com.anamensis.server.dto.*;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.LoginHistoryResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.resultMap.MemberResultMap;
import com.anamensis.server.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;


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
    private final PointService ps;
    private final PointHistoryService phs;
    private final TableCodeService tableCodeService;

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

        AtomicReference<Member> member = new AtomicReference<>();

        return userService.saveUser(user)
                .doOnNext(member::set)
                .flatMap(u -> attendanceService.init(u.getId()))
                .publishOn(Schedulers.boundedElastic())
                .then(Mono.fromCallable(() -> UserResponse.Status
                          .transToStatus(HttpStatus.CREATED, "User created"))
                )
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(s -> {
                    if(!s.getStatus().equals(HttpStatus.CREATED)) return;
                    ps.selectByIdOrName("1")
                        .publishOn(Schedulers.boundedElastic())
                        .doOnNext(p -> {
                            userService.updatePoint(member.get().getId(), p.getPoint())
                                .subscribe();
                        })
                        .publishOn(Schedulers.boundedElastic())
                        .doOnNext(p -> {
                            tableCodeService.findByIdByTableName(0, "attendance")
                                .flatMap(t -> {
                                    PointHistory ph = new PointHistory();
                                    ph.setMemberPk(member.get().getId());
                                    ph.setPointCodePk(p.getId());
                                    ph.setTableCodePk(t.getId());
                                    ph.setTableRefPk(member.get().getId());
                                    ph.setCreateAt(LocalDateTime.now());
                                    return phs.insert(ph);
                                })
                                .subscribe();
                        })
                        .publishOn(Schedulers.boundedElastic())
                        .doOnNext(b -> {
                            userService.findUserInfoCache(member.get().getUserId())
                                .subscribe();
                        })
                        .subscribe();
                });
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

    @GetMapping("roles")
    public Mono<List<RoleType>> roles(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return Mono.just(userDetails.getAuthorities())
            .map(authorities -> authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(RoleType::valueOf)
                    .toList()
            );
    }

    @GetMapping("info")
    public Mono<UserResponse.MyPage> info(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserInfoCache(userDetails.getUsername());
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
                })
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(s -> {
                    if(!s.getStatus().equals(HttpStatus.OK)) return;
                        userService.addUserInfoCache(userDetails.getUsername())
                            .subscribe();
                });
    }

    @GetMapping("get-point")
    public Mono<UserResponse.GetPoint> getPoint(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
            .flatMap(m ->
                Mono.just(new UserResponse.GetPoint(m.getPoint()))
            );
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
                })
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(s -> {
                    if(!s.getStatus().equals(HttpStatus.OK)) return;
                    userService.addUserInfoCache(userDetails.getUsername())
                        .subscribe();
                });
    }


    @PublicAPI
    @PostMapping("find-id-email")
    public Mono<Boolean> findIdByEmail(
            @RequestBody UserRequest.FindUserId findId
    ) {
        return userService.findMemberByEmailAndUserId(findId.getEmail(), null)
            .flatMap(b -> {
                EmailVerify ev = new EmailVerify();
                ev.setEmail(findId.getEmail());

                return emailVerifyService.insert(ev);
            })
            .flatMap(b -> Mono.just(true))
            .onErrorReturn(false);
    }

    @PublicAPI
    @PostMapping("find-id-email-confirm")
    public Mono<UserResponse.FindUserId> findIdByEmailVerify(
           @Valid @RequestBody UserRequest.FindUserId findId
    ) {

        EmailVerify ev = new EmailVerify();
        ev.setEmail(findId.getEmail());
        ev.setCode(findId.getVerifyCode());

        return emailVerifyService.updateIsUse(ev)
                .flatMap(b ->
                    b ? userService.findMemberByEmailAndUserId(findId.getEmail(), null)
                            .flatMap(m -> Mono.just(new UserResponse.FindUserId(b, m.getUserId())))
                      : Mono.just(new UserResponse.FindUserId(b, ""))
                );
    }

    @PublicAPI
    @PostMapping("reset-password")
    public Mono<UserResponse.ResetPwd> resetPassword(
        @Valid @RequestBody UserRequest.ResetPwd resetPwd
    ) {
        return switch (resetPwd.getProgress()) {
            case CONFIRMED -> sendVerifyEmail(resetPwd);
            case VERIFIED -> verifyEmailCode(resetPwd);
            case RESET -> resetPwd(resetPwd);
            default -> Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.FAILED, false)).log();
        };
    }

    private Mono<UserResponse.ResetPwd> sendVerifyEmail(UserRequest.ResetPwd resetPwd) {
        if(resetPwd.getPwd() != null || resetPwd.getVerifyCode() != null)
            return Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.FAILED, false));

        return userService.findMemberByEmailAndUserId(resetPwd.getEmail(), resetPwd.getUserId())
                .flatMap(m -> {
                    EmailVerify ev = new EmailVerify();
                    ev.setEmail(resetPwd.getEmail());
                    return emailVerifyService.insert(ev);
                })
                .flatMap(b -> Mono.just(true))
                .onErrorReturn(false)
                .flatMap(b -> Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.CONFIRMED, b)));
    }

    private Mono<UserResponse.ResetPwd> verifyEmailCode(UserRequest.ResetPwd resetPwd) {
        if(resetPwd.getIsVerified() == null || resetPwd.getPwd() != null)
            return Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.FAILED, false));

        EmailVerify ev = new EmailVerify();
        ev.setEmail(resetPwd.getEmail());
        ev.setCode(resetPwd.getVerifyCode());

        return emailVerifyService.updateIsUse(ev)
            .flatMap(b -> Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.VERIFIED, b)));
    }

    private Mono<UserResponse.ResetPwd> resetPwd(UserRequest.ResetPwd resetPwd) {
        if(resetPwd.getVerifyCode() == null || resetPwd.getIsVerified() == null || resetPwd.getPwd() == null)
            return Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.FAILED, false));

        return userService.resetPwd(resetPwd)
            .flatMap(b -> Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.RESET, b)));
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
