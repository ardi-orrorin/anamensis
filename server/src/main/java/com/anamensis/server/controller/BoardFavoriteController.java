package com.anamensis.server.controller;

import com.anamensis.server.dto.request.BoardFavoriteRequest;
import com.anamensis.server.entity.BoardFavorite;
import com.anamensis.server.service.BoardFavoriteService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/board-favorites")
public class BoardFavoriteController {

    private final BoardFavoriteService boardFavoriteService;
    private final UserService userService;

    @GetMapping("")
    public Mono<List<String>> findAll(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return userService.findUserByUserId(userDetails.getUsername())
            .flatMapMany(user -> boardFavoriteService.findAllCache(user.getId()))
            .collectList();
    }

    @GetMapping("{id}")
    public Mono<Boolean> existFavorite(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        if(userDetails == null) {
            return Mono.just(false);
        }
        return userService.findUserByUserId(userDetails.getUsername())
            .flatMap(user -> boardFavoriteService.existFavorite(user.getId(), id));
    }


    @PostMapping("")
    public Mono<Boolean> save(
        @RequestBody BoardFavoriteRequest.Save req,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        if(userDetails == null) {
            return Mono.just(false);
        }
        return userService.findUserByUserId(userDetails.getUsername())
            .flatMap(user -> {
                BoardFavorite bf = new BoardFavorite();
                bf.setBoardPk(req.getId());
                bf.setMemberPk(user.getId());
                return boardFavoriteService.save(bf);
            });
    }

    @DeleteMapping("{id}")
    public Mono<Boolean> delete(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        if(userDetails == null) {
            return Mono.just(false);
        }

        return userService.findUserByUserId(userDetails.getUsername())
            .flatMap(user -> boardFavoriteService.deleteByBoardPkAndMemberPk(id, user.getId()));
    }
}
