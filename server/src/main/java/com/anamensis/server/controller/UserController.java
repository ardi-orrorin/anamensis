package com.anamensis.server.controller;


import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.RequestEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping(value = "/login")
    public Mono<String> login(Mono<User> user) {
        return user
                .log()
                .map(u -> userService.findUserByUserIdAndPwd(u.username(), u.password()))
                .map(token -> "Bearer " + token);
    }

    @GetMapping(value = "/test")
    public Mono<String> test(@AuthenticationPrincipal UserDetails user) {
        log.info("test : {}", user);

        return Mono.just("test");
    }

    private record User(
        String username,
        String password
    ) {}


}
