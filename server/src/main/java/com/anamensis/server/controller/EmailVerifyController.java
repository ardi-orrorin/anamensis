package com.anamensis.server.controller;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.service.EmailVerifyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/verify")
public class EmailVerifyController {

    private final EmailVerifyService emailVerifyService;

    @PublicAPI
    @PostMapping("email")
    public Mono<String> verify(@RequestBody EmailVerify email) {
        return emailVerifyService.insert(email);
    }

    @PublicAPI
    @PostMapping("verifyCode")
    public Mono<Boolean> verifyCode(@RequestBody EmailVerify email) {
        return emailVerifyService.updateIsUse(email);
    }


}
