package com.anamensis.server.controller;


import com.anamensis.server.entity.User;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.RequestEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TokenProvider tokenProvider;

    @PostMapping(value = "/login")
    public Mono<String> login(Mono<User> user) {
        return user.flatMap(u -> userService.findUserByUserId(u.username(), u.password()))
                   .map(u -> tokenProvider.generateToken(u.userId()));
    }

    @PostMapping("/signup")
    public Mono<Integer> signup(@Valid @RequestBody com.anamensis.server.entity.User user) {
        return userService.saveUser(Mono.just(user));
    }

    @GetMapping(value = "/test")
    public Mono<String> test(@AuthenticationPrincipal UserDetails user) {
        return Mono.just("test");
    }

    private record User(
        String username,
        String password
    ) {}


}
