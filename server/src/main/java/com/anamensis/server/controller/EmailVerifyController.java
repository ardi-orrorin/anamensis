package com.anamensis.server.controller;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.service.EmailVerifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("/verify")
public class EmailVerifyController {

    private final EmailVerifyService emailVerifyService;

    @PostMapping("/email")
    public Mono<String> verify(@RequestBody Mono<EmailVerify> email) {
        return email.map(emailVerifyService::insert);
        // add email sending logic here
    }

    @PostMapping("")
    public Mono<Boolean> verifyCode(@RequestBody Mono<EmailVerify> email) {
        return email.map(emailVerifyService::updateIsUse);
    }


}
