package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.request.UserConfigSmtpRequest;
import com.anamensis.server.entity.UserConfigSmtp;
import com.anamensis.server.service.UserConfigSmtpService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-config-smtp")
public class UserConfigSmtpController {

    private final UserConfigSmtpService userConfigSmtpService;
    private final UserService userService;

    @GetMapping("")
    public Mono<PageResponse<UserConfigSmtp>> list(
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .map(u -> userConfigSmtpService.selectByUserPk(u.getId()))
                .flatMap(Flux::collectList)
                .map(r -> PageResponse.<UserConfigSmtp>builder()
                            .page(new Page())
                            .content(r)
                            .build()
                );
    }

    @GetMapping("{id}")
    public Mono<UserConfigSmtp> get(
            @PathVariable long id
    ) {
        return Mono.just(id)
                   .flatMap(userConfigSmtpService::selectById);
    }

    @PostMapping("")
    public Mono<UserConfigSmtp> save(
            @RequestBody Mono<UserConfigSmtpRequest.UserConfigSmtp> userConfigSmtp,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .zipWith(userConfigSmtp)
                .map(t -> UserConfigSmtpRequest.UserConfigSmtp.fromEntity(t.getT2(), t.getT1()))
                .flatMap(userConfigSmtpService::save);
    }

    @PutMapping("")
    public Mono<Boolean> update(
            @RequestBody Mono<UserConfigSmtp> userConfigSmtp,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .map(u -> userService.findUserByUserId(u.getUsername()))
                .zipWith(userConfigSmtp)
                .doOnNext(t -> t.getT2().setUserPk(t.getT1().getId()))
                .flatMap(t -> userConfigSmtpService.update(t.getT2()));
    }
}
