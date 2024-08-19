package com.anamensis.server.service;

import com.anamensis.server.dto.CacheExpire;
import com.anamensis.server.dto.response.BoardTemplateResponse;
import com.anamensis.server.entity.BoardTemplate;
import com.anamensis.server.mapper.BoardTemplateMapper;
import lombok.RequiredArgsConstructor;
import org.reactivestreams.Publisher;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardTemplateService {
    private static final String BOARD_TEMPLATE_PREFIX = "board:template:member:%s";
    private static final CacheExpire boardTemplateExpire = new CacheExpire(1, TimeUnit.DAYS);

    private final BoardTemplateMapper boardTemplateMapper;
    private final VirtualThreadTaskExecutor virtualThreadTaskExecutor;
    private final RedisTemplate<String, Object> redisTemplate;


    public Flux<BoardTemplateResponse.List> findAll(long memberPk) {
        String key = String.format(BOARD_TEMPLATE_PREFIX, memberPk);
        if(redisTemplate.hasKey(key)) {
            return this.cacheFindAll(memberPk)
                .doOnNext($ -> redisTemplate.expire(key, boardTemplateExpire.timeout(), boardTemplateExpire.timeUnit()));
        }
        return updateCache(memberPk);
    }

    public Flux<BoardTemplateResponse.List> cacheFindAll(long memberPk) {
        String key = String.format(BOARD_TEMPLATE_PREFIX, memberPk);
        return Flux.fromIterable(redisTemplate.boundSetOps(key).members())
                .cast(BoardTemplateResponse.List.class);
    }

    public Mono<BoardTemplate> findById(long id) {
        return Mono.justOrEmpty(boardTemplateMapper.findById(id))
                .switchIfEmpty(Mono.error(new RuntimeException("Not found id: " + id)));
    }

    public Mono<Boolean> save(BoardTemplate boardTemplate) {
        return Mono.fromCallable(() -> boardTemplateMapper.save(boardTemplate) > 0)
                .onErrorReturn(false)
                .publishOn(Schedulers.fromExecutor(virtualThreadTaskExecutor))
                .doOnNext($ -> updateCache(boardTemplate.getMemberPk()).subscribe());
    }

    public Mono<Boolean> update(BoardTemplate boardTemplate) {
        return Mono.fromCallable(() -> boardTemplateMapper.update(boardTemplate) > 0)
                .onErrorReturn(false)
                .publishOn(Schedulers.fromExecutor(virtualThreadTaskExecutor))
                .doOnNext($ -> updateCache(boardTemplate.getMemberPk()).subscribe());
    }

    public Mono<Boolean> disable(List<Long> ids, long memberPk) {
        AtomicInteger count = new AtomicInteger(0);
        return Flux.fromIterable(ids)
                .doOnNext(id -> {
                    if(boardTemplateMapper.disabled(id, memberPk) > 0) {
                        count.getAndIncrement();
                    }
                })
                .last()
                .publishOn(Schedulers.fromExecutor(virtualThreadTaskExecutor))
                .doOnNext($ -> updateCache(memberPk).subscribe())
                .flatMap($ -> Mono.just(count.get() == ids.size()));
    }

    private Flux<BoardTemplateResponse.List> updateCache(long memberPk) {
        String key = String.format(BOARD_TEMPLATE_PREFIX, memberPk);

        redisTemplate.delete(key);
        return Flux.fromIterable(boardTemplateMapper.findAll(memberPk))
            .map(BoardTemplateResponse.List::from)
            .doOnNext(list -> {
                redisTemplate.boundSetOps(key)
                    .add(list);

                redisTemplate.expire(key, boardTemplateExpire.timeout(), boardTemplateExpire.timeUnit());
            });
    }
}
