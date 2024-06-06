package com.anamensis.server.controller;


import com.anamensis.server.dto.response.RateResponse;
import com.anamensis.server.service.RateService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/rate")
@Slf4j
public class RateController {

    private final RateService rateService;

    private final UserService userService;

    @GetMapping("{id}")
    public Mono<RateResponse.Info> hasRate(
            @PathVariable(name = "id") long boardPk,
            @AuthenticationPrincipal UserDetails user
    ) {
        log.info("hasRate: {}", boardPk);
        return userService.findUserByUserId(user.getUsername())
                .flatMap(u -> rateService.hasRate(boardPk, u.getId()))
                .map(hasRate -> {
                    RateResponse.Info info = new RateResponse.Info();
                    info.setStatus(hasRate);
                    info.setId(boardPk);
                    return info;
                })
                .flatMap(res -> rateService.countRate(boardPk)
                    .map(count -> {
                        res.setCount(count);
                        return res;
                    })
                );
    }

    @GetMapping("add/{id}")
    public Mono<RateResponse.Info> addRate(
            @PathVariable(name = "id") long boardPk,
            @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                .flatMap(u -> rateService.addRate(boardPk, u.getId()))
                .flatMap($ -> rateService.countRate(boardPk))
                .map(count -> {
                    RateResponse.Info info = new RateResponse.Info();
                    info.setStatus(true);
                    info.setCount(count);
                    info.setId(boardPk);
                    return info;
                });
    }

    @DeleteMapping("{id}")
    public Mono<RateResponse.Info> deleteRate(
            @PathVariable(name = "id") long boardPk,
            @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
            .flatMap(u -> userService.findUserByUserId(u.getUsername()))
            .flatMap(u -> rateService.removeRate(boardPk, u.getId()))
            .flatMap($ -> rateService.countRate(boardPk))
            .map(count -> {
                RateResponse.Info info = new RateResponse.Info();
                info.setStatus(false);
                info.setCount(count);
                info.setId(boardPk);
                return info;
            });
    }

    @GetMapping("count/{id}")
    public Mono<RateResponse.Info> countRate(
            @PathVariable(name = "id") long boardPk
    ) {
        return rateService.countRate(boardPk)
                .map(count -> {
                    RateResponse.Info info = new RateResponse.Info();
                    info.setCount(count);
                    info.setId(boardPk);
                    return info;
                });
    }


}
