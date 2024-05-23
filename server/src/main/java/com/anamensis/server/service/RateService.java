package com.anamensis.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class RateService {

    private final RedisTemplate<String, String> redisTemplate;

    private final String RATE_PREFIX = "board:%d:rate";
    private final String USER_BOARD_PREFIX = "user:%d:board:rate";

    public Mono<Boolean> addRate(long boardPk, long userPk) {
        String rateKey = String.format(RATE_PREFIX, boardPk);
        String rateValue = String.valueOf(userPk);

        String userKey = String.format(USER_BOARD_PREFIX, userPk);
        String userValue = String.valueOf(boardPk);

        return Mono.just(redisTemplate.boundSetOps(rateKey).add(rateValue))
                .doOnNext($ -> redisTemplate.boundSetOps(userKey).add(userValue))
                .map(result -> result == 1);
    }

    public Mono<Boolean> removeRate(long boardPk, long userPk) {
        String rateKey = String.format(RATE_PREFIX, boardPk);
        String rateValue = String.valueOf(userPk);

        String userKey = String.format(USER_BOARD_PREFIX, userPk);
        String userValue = String.valueOf(boardPk);

        return Mono.just(redisTemplate.boundSetOps(rateKey).remove(rateValue))
                .doOnNext($ -> redisTemplate.boundSetOps(userKey).remove(userValue))
                .map(result -> result == 1);
    }

    public Mono<Boolean> hasRate(long boardPk, long userPk) {
        String key = String.format(RATE_PREFIX, boardPk);
        String value = String.valueOf(userPk);

        return Mono.just(redisTemplate.boundSetOps(key).isMember(value));
    }

    public Mono<Long> countRate(long boardPk) {
        String key = String.format(RATE_PREFIX, boardPk);

        return Mono.just(redisTemplate.boundSetOps(key).size());
    }
}
