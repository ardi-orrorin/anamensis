package com.anamensis.server.controller;


import com.anamensis.server.dto.*;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.LoginHistoryResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.provider.RedisCacheProvider;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.resultMap.MemberResultMap;
import com.anamensis.server.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;
    private final OTPService otpService;
    private final LoginHistoryService loginHistoryService;
    private final EmailVerifyService emailVerifyService;
    private final TokenProvider tokenProvider;
    private final FileService fileService;
    private final RedisCacheProvider redisCacheService;

    private final Map<SystemSettingKey, SystemSetting> systemSettings;


    @MasterAPI
    @GetMapping("list")
    public Mono<PageResponse<UserResponse.List>> findAll(
        Page page,
        UserRequest.Params params
    ) {

        Mono<List<UserResponse.List>> users = userService.findAllMember(page, params)
            .collectList()
            .subscribeOn(Schedulers.boundedElastic());

        Mono<Long> count = userService.count(params)
            .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(users, count)
            .flatMap(t -> {
                page.setTotal(t.getT2().intValue());
                return Mono.just(new PageResponse<>(page, t.getT1()));
            });
    }

    @MasterAPI
    @PutMapping("role")
    public Mono<Boolean> updateRole(
            @RequestBody UserRequest.UpdateRole role
    ) {
        return userService.updateRole(role);
    }

    @PublicAPI
    @PostMapping("login")
    public Mono<UserResponse.Auth> login(
            @RequestBody UserRequest.Login user
    ) {

        boolean isEmailVerify = systemSettings.get(SystemSettingKey.SIGN_UP)
            .getValue().getBoolean("emailVerification");

        Mono<Member> member = userService.findUserByUserId(user.getUsername(), user.getPassword())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<String> emailVerifyResult = member.flatMap(u -> {
                    if(AuthType.EMAIL.equals(u.getSAuthType()) && isEmailVerify) {
                        EmailVerify emailVerify = new EmailVerify();
                        emailVerify.setEmail(u.getEmail());
                        return emailVerifyService.insert(emailVerify);
                    }
                    return Mono.just("");
                });

        return Mono.zip(member, emailVerifyResult)
                .map(t -> UserResponse.Auth.builder()
                       .authType(isEmailVerify ? t.getT1().getSAuthType() : AuthType.NONE)
                       .verity(isEmailVerify && t.getT1().getSAuth())
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

        member.flatMap(u ->
            loginHistoryService.confirmedLogin(u.getMember(), device)
                .flatMap(b -> {
                    if(b) return Mono.just(true);
                    return userService.unConfirmLogin(u.getMember(), device);
                })
        )
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
    @PostMapping("oauth")
    public Mono<UserResponse.Login> oauth2Login(
        @RequestBody UserRequest.OauthLogin user,
        Device device
    ) {
        Mono<MemberResultMap> member = userService.findOauthUser(user)
            .subscribeOn(Schedulers.boundedElastic())
            .share();

        Mono<Token> token = member.flatMap(u -> generateToken(u.getMember().getUserId()))
            .subscribeOn(Schedulers.boundedElastic());

        member.flatMap(u -> loginHistoryService.save(device, u.getMember()))
            .subscribeOn(Schedulers.boundedElastic())
            .subscribe();

        member.flatMap(u ->
                loginHistoryService.confirmedLogin(u.getMember(), device)
                    .flatMap(b -> {
                        if(b) return Mono.just(true);
                        return userService.unConfirmLogin(u.getMember(), device);
                    })
            )
            .subscribeOn(Schedulers.boundedElastic())
            .subscribe();

        return notAuth(member, token);
    }


    @PublicAPI
    @PostMapping("signup")
    public Mono<UserResponse.Status> signup(
            @Valid @RequestBody
            UserRequest.Register user
    ) {
        return userService.saveUser(user, false)
            .flatMap(m -> {
                UserResponse.Status res = UserResponse.Status
                    .transToStatus(HttpStatus.CREATED, "User created");

                return Mono.just(res);
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
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestHeader(name = "Cache-Data", required = false) boolean cache
    ) {
        return cache && redisCacheService.enable()
            ? userService.findUserInfoCache(userDetails.getUsername())
            : userService.findUserInfo(userDetails.getUsername())
                .map(UserResponse.MyPage::transToMyPage);
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

    @GetMapping("info/user/{userId}")
    public Mono<UserResponse.ChatUserInfo> info(
            @PathVariable String userId
    ) {
        return userService.findUserInfo(userId)
            .map(UserResponse.ChatUserInfo::from);
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

        AtomicReference<Member> memberAtomic = new AtomicReference<>();

        return userService.findUserByUserId(userDetails.getUsername())
                .doOnNext(memberAtomic::set)
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
                })
                .doOnNext(s -> {
                    if(!s.getStatus().equals(HttpStatus.OK)) return;
                    userService.changeAuthAlertEmail(memberAtomic.get(), AuthType.fromString(auth.getSauthType()))
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
            default -> Mono.just(new UserResponse.ResetPwd(ResetPwdProgress.FAILED, false));
        };
    }

    @PostMapping("/change-password")
    public Mono<StatusResponse> changePassword(
            @Valid @RequestBody UserRequest.ChangePassword changePwd,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return userService.confirmPassword(userDetails.getUsername(), changePwd.getCurPwd())
            .flatMap(b -> {
                if (!b) return Mono.just(false);
                return switch (changePwd.getStatus()) {
                    case READY     -> Mono.just(b);
                    case CONFIRMED -> this.changePwd(userDetails.getUsername(), changePwd.getNewPwd());
                    default        -> Mono.just(false);
                };
            })
            .flatMap(b -> {
                StatusResponse sr = StatusResponse.builder()
                    .status(b ? StatusType.SUCCESS : StatusType.FAIL)
                    .message(b ? "Success" : "Failed")
                    .timestamp(LocalDateTime.now())
                    .build();

                return Mono.just(sr);
            });
    }

    private Mono<Boolean> changePwd(String userId, String newPwd) {

        return userService.changePwd(userId, newPwd);
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
