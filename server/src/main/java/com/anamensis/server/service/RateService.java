package com.anamensis.server.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class RateService {
    private static final String RATE_PREFIX = "board:%d:rate";
    private static final String USER_BOARD_PREFIX = "user:%d:board:rate";

    private final RedisTemplate<String, String> redisTemplate;


    public Mono<Boolean> addRate(long boardPk, long userPk) {
        String rateKey = String.format(RATE_PREFIX, boardPk);
        String rateValue = String.valueOf(userPk);

        String userKey = String.format(USER_BOARD_PREFIX, userPk);
        String userValue = String.valueOf(boardPk);

        redisTemplate.boundSetOps(rateKey).add(rateValue);
        return Mono.fromCallable(() -> redisTemplate.boundSetOps(userKey).add(userValue) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> removeRate(long boardPk, long userPk) {
        String rateKey = String.format(RATE_PREFIX, boardPk);
        String rateValue = String.valueOf(userPk);

        String userKey = String.format(USER_BOARD_PREFIX, userPk);
        String userValue = String.valueOf(boardPk);

        redisTemplate.boundSetOps(rateKey).remove(rateValue);
        return Mono.fromCallable(() -> redisTemplate.boundSetOps(userKey).remove(userValue) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> hasRate(long boardPk, long memberPk) {
        String key = String.format(RATE_PREFIX, boardPk);
        String value = String.valueOf(memberPk);

        return Mono.fromCallable(() -> redisTemplate.boundSetOps(key).isMember(value));
    }

    public Mono<Long> countRate(long boardPk) {
        String key = String.format(RATE_PREFIX, boardPk);

        return Mono.fromCallable(() -> redisTemplate.boundSetOps(key).size());
    }
}
