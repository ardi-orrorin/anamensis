package com.anamensis.server.controller;

import com.anamensis.server.entity.AuthType;
import com.anamensis.server.service.OTPService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@RequiredArgsConstructor
@RequestMapping("/otp")
public class OTPController {

    private final OTPService otpService;
    private final UserService userService;

    @GetMapping("")
    public Mono<String> generate(@AuthenticationPrincipal Mono<UserDetails> user){
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .doOnNext(u -> {
                    otpService.selectByUserPk(u.getId())
                            .ifPresent((otp)-> {
                                throw new RuntimeException("already exist");
                            });
                })
                .map(otpService::insert);
    }

    @GetMapping("/exist")
    public Mono<Boolean> exist(@AuthenticationPrincipal Mono<UserDetails> user){
        return user.map(u -> userService.findUserByUserId(u.getUsername()))
                .map(u -> otpService.existByUserPk(u.getId()));
    }

    @PostMapping("/verify")
    public Mono<String> verify(
            @AuthenticationPrincipal Mono<UserDetails> user,
            @RequestBody Mono<Integer> code
    ){
        return user.zipWith(code)
                .map(tuple ->
                    tuple.mapT1(u -> otpService.selectByUserId(u.getUsername()))
                )
                .map(otpService::verify)
                .flatMap(t -> userService.editAuth(t.getT1().getUserPk(), true, AuthType.OTP))
                .map(t -> t ? "success" : "fail");
    }

    @PutMapping("/disable")
    public Mono<String> disable(@AuthenticationPrincipal Mono<UserDetails> user){
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .publishOn(Schedulers.boundedElastic())
                .flatMap(u -> otpService.disableOTP(u.getId()))
                .flatMap(t -> userService.editAuth(t.getT1(), false, AuthType.NONE))
                .map(b -> b ? "success" : "fail");
    }

}
