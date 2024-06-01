package com.anamensis.server.controller;

import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.OTP;
import com.anamensis.server.service.OTPService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/otp")
@Slf4j
public class OTPController {

    private final OTPService otpService;
    private final UserService userService;

    @GetMapping("")
    public Mono<String> generate(
            @AuthenticationPrincipal UserDetails user
    ){
        AtomicReference<Member> memberAtomic = new AtomicReference<>();
        return userService.findUserByUserId(user.getUsername())
                .doOnNext(memberAtomic::set)
                .flatMap(u -> otpService.selectByMemberPk(u.getId()))
                .onErrorComplete()
                .flatMap(otp ->
                    otp != null && otp.getHash() != null
                    ? otpService.disableOTP(memberAtomic.get().getId())
                    : Mono.just(true)
                )
                .then(Mono.defer(() -> otpService.insert(memberAtomic.get())));
    }

    @GetMapping("/exist")
    public Mono<Boolean> exist(
            @AuthenticationPrincipal UserDetails user
    ){
        return userService.findUserByUserId(user.getUsername())
                .flatMap(u -> otpService.existByMemberPk(u.getId()));
    }

    @PostMapping("/verify")
    public Mono<Boolean> verify(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody Integer code
    ){
        AtomicReference<OTP> otpAtomic = new AtomicReference<>();
        return otpService.selectByUserId(user.getUsername())
                .doOnNext(otpAtomic::set)
                .flatMap(otp -> otpService.verify(otp.getHash(), code))
                .flatMap(result ->
                    result ? userService.editAuth(otpAtomic.get().getMemberPk(), true, AuthType.OTP)
                           : Mono.just(false)
                )
                .onErrorReturn(false);
    }

    @DeleteMapping("disable")
    public Mono<Boolean> disable(
        @AuthenticationPrincipal UserDetails user
    ){
        AtomicReference<Member> memberAtomic = new AtomicReference<>();
        return userService.findUserByUserId(user.getUsername())
                .doOnNext(memberAtomic::set)
                .flatMap(u -> otpService.disableOTP(u.getId()))
                .flatMap(result ->
                    result ? userService.editAuth(memberAtomic.get().getId(), false, AuthType.NONE)
                           : Mono.just(false)
                )
                .onErrorReturn(false);
    }

}
