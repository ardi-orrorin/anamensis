package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.request.UserConfigSmtpRequest;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.MemberConfigSmtp;
import com.anamensis.server.service.MemberConfigSmtpService;
import com.anamensis.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/user-config-smtp")
public class UserConfigSmtpController {

    private final MemberConfigSmtpService userConfigSmtpService;
    private final UserService userService;

    @GetMapping("")
    public Mono<PageResponse<MemberConfigSmtp>> list(
            @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                   .flatMapMany(u -> userConfigSmtpService.selectByUserPk(u.getId()))
                   .collectList()
                   .map(r -> new PageResponse<>(new Page(), r));
    }

    @GetMapping("{id}")
    public Mono<MemberConfigSmtp> get(
            @PathVariable long id,
            @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                 .flatMap(u -> userConfigSmtpService.selectById(id, u.getId()));
    }

    @PostMapping("")
    public Mono<MemberConfigSmtp> save(
            @Valid @RequestBody UserConfigSmtpRequest.MemberConfigSmtp userConfigSmtp,
            @AuthenticationPrincipal UserDetails user
    ) {

        AtomicReference<Member> member = new AtomicReference<>();

        return userService.findUserByUserId(user.getUsername())
                   .doOnNext(member::set)
                   .map(t -> UserConfigSmtpRequest.MemberConfigSmtp.fromEntity(userConfigSmtp, member.get()))
                   .flatMap(userConfigSmtpService::save);
    }

    @PutMapping("")
    public Mono<Boolean> update(
            @Valid @RequestBody UserConfigSmtpRequest.MemberConfigSmtp userConfigSmtp,
            @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                .map(u -> UserConfigSmtpRequest.MemberConfigSmtp.fromEntity(userConfigSmtp, u))
                .flatMap(userConfigSmtpService::update);
    }

    @GetMapping("/disabled/{id}")
    public Mono<Boolean> disabled(
            @PathVariable long id,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user.flatMap(u -> userService.findUserByUserId(u.getUsername()))
                   .flatMap(u -> userConfigSmtpService.disabled(id, u.getId()));
    }


    @PostMapping("test")
    public Mono<Boolean> testConnection(
            @Valid @RequestBody UserConfigSmtpRequest.Test test
    ) {
        MemberConfigSmtp userConfigSmtp = UserConfigSmtpRequest.Test.toUserConfigSmtp(test);
        return userConfigSmtpService.testConnection(userConfigSmtp);
    }
}
