package com.anamensis.server.service;

import com.anamensis.server.entity.BoardFavorite;
import com.anamensis.server.mapper.BoardFavoriteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardFavoriteService {

    private final BoardFavoriteMapper boardFavoriteMapper;

    private final RedisTemplate<String, String> redisTemplate;

    private final VirtualThreadTaskExecutor virtualThreadTaskExecutor;

    private final String KEY = "board:favorite:member:%s";

    public Flux<String> findAllCache(Long memberPk) {

        String key = String.format(KEY, memberPk);

        return Mono.fromCallable(()-> redisTemplate.hasKey(key))
                .flatMap(hasKey -> {
                    if(hasKey) {
                        return Mono.just(true);
                    }
                    return updateCache(memberPk);
                })
                .flatMapIterable(isHas -> redisTemplate.boundSetOps(key).members());
    }

    public Mono<Boolean> existFavorite(Long memberPk, Long boardPk) {
        return Mono.fromCallable(() ->
            redisTemplate.boundSetOps("board:favorite:member:" + memberPk)
                .isMember(boardPk.toString())
        );
    }

    public Flux<String> findAll(Long memberPk) {
        return Flux.fromIterable(boardFavoriteMapper.findAllByMemberPk(memberPk))
                .map(BoardFavorite::getBoardPk)
                .map(String::valueOf);
    }

    public Mono<Boolean> save(BoardFavorite boardFavorite) {
        return Mono.fromCallable(() -> boardFavoriteMapper.save(boardFavorite) > 0)
                .publishOn(Schedulers.fromExecutor(virtualThreadTaskExecutor))
                .doOnNext($ -> updateCache(boardFavorite.getMemberPk()).subscribe())
                .onErrorReturn(false);
    }

    public Mono<Boolean> deleteByBoardPkAndMemberPk(Long boardPk, Long memberPk) {
        return Mono.fromCallable(() -> boardFavoriteMapper.deleteByBoardPkAndMemberPk(boardPk, memberPk) > 0)
                .publishOn(Schedulers.fromExecutor(virtualThreadTaskExecutor))
                .doOnNext($ -> updateCache(memberPk).subscribe())
                .onErrorReturn(false);
    }

    public Mono<Boolean> updateCache(Long memberPk) {

        String key = String.format(KEY, memberPk);

        return Mono.fromCallable(() -> redisTemplate.delete(key))
            .flatMapMany($-> this.findAll(memberPk))
            .doOnNext(boardId -> redisTemplate.boundSetOps(key).add(boardId))
            .then(Mono.just(true));

    }

}
