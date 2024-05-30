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
import reactor.util.function.Tuples;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/otp")
public class OTPController {

    private final OTPService otpService;
    private final UserService userService;

    @GetMapping("")
    public Mono<String> generate(@AuthenticationPrincipal Mono<UserDetails> user){
        return user
                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(u -> {
                    //check otp already exist
                    otpService.selectByMemberPk(u.getId())
                            .doOnSuccess(otp -> {
                                new RuntimeException("already exist");
                            }).subscribe();
                })
                .flatMap(otpService::insert);
    }

    @GetMapping("/exist")
    public Mono<Boolean> exist(@AuthenticationPrincipal Mono<UserDetails> user){
        return user.flatMap(u -> userService.findUserByUserId(u.getUsername()))
                .flatMap(u -> otpService.existByMemberPk(u.getId()));
    }

//    @PostMapping("/verify")
//    public Mono<String> verify(
//            @AuthenticationPrincipal Mono<UserDetails> user,
//            @RequestBody Mono<Integer> code
//    ){
//        return user.zipWith(code)
//                .flatMap(tuple ->
//                    otpService.selectByUserId(tuple.getT1().getUsername())
//                            .map(t -> Tuples.of(t, tuple.getT2()))
//                )
//                .flatMap(otpService::verify)
//                .flatMap(t -> userService.editAuth(t.getT1().getMemberPk(), true, AuthType.OTP))
//                .map(t -> t ? "success" : "fail");
//    }

// todo : 로직 수정 예정
//    @PutMapping("/disable")
//    public Mono<String> disable(@AuthenticationPrincipal Mono<UserDetails> user){
//        return user
//                .flatMap(u -> userService.findUserByUserId(u.getUsername()))
//                .publishOn(Schedulers.boundedElastic())
//                .flatMap(u -> otpService.disableOTP(u.getId()))
//                .flatMap(t -> userService.editAuth(t.getT1(), false, AuthType.NONE))
//                .map(b -> b ? "success" : "fail");
//    }

}
