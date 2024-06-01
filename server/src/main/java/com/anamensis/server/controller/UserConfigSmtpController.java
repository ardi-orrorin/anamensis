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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
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
                   .map(r -> PageResponse.<MemberConfigSmtp>builder()
                               .page(new Page())
                               .content(r)
                               .build()
                   );
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
            @Valid @RequestBody UserConfigSmtpRequest.UserConfigSmtp userConfigSmtp,
            @AuthenticationPrincipal UserDetails user
    ) {

        AtomicReference<Member> member = new AtomicReference<>();

        return userService.findUserByUserId(user.getUsername())
                   .doOnNext(member::set)
                   .map(t -> UserConfigSmtpRequest.UserConfigSmtp.fromEntity(userConfigSmtp, member.get()))
                   .flatMap(userConfigSmtpService::save);
    }

    @PutMapping("")
    public Mono<Boolean> update(
            @RequestBody Mono<MemberConfigSmtp> userConfigSmtp,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user.flatMap(u -> userService.findUserByUserId(u.getUsername()))
                   .zipWith(userConfigSmtp)
                   .doOnNext(t -> t.getT2().setMemberPk(t.getT1().getId()))
                   .flatMap(t -> userConfigSmtpService.update(t.getT2()));
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
    public Mono<Boolean> testConnection(@RequestBody UserConfigSmtpRequest.Test test) {
        return Mono.just(test)
                   .map(UserConfigSmtpRequest.Test::toUserConfigSmtp)
                   .flatMap(userConfigSmtpService::testConnection);
    }
}
