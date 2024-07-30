package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.BoardBlockHistory;
import com.anamensis.server.mapper.BoardBlockHistoryMapper;
import com.anamensis.server.resultMap.BoardBlockHistoryResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class BoardBlockHistoryService {
    private final BoardBlockHistoryMapper boardBlockHistoryMapper;

    public Mono<Long> count(long memberPk) {
        return Mono.fromCallable(() -> boardBlockHistoryMapper.count(memberPk));
    }

    public Flux<BoardBlockHistoryResultMap.ResultMap> findByAll(Page page) {
        return Flux.fromIterable(boardBlockHistoryMapper.findByAll(0, page));
    }

    public Flux<BoardBlockHistoryResultMap.ResultMap> findByMemberPk(long memberPk, Page page) {
        return Flux.fromIterable(boardBlockHistoryMapper.findByAll(memberPk, page));
    }

    public Mono<BoardBlockHistoryResultMap.ResultMap> findByPk(long pk) {
        return Mono.justOrEmpty(boardBlockHistoryMapper.findByPk(pk))
            .switchIfEmpty(Mono.error(new RuntimeException("Not found")));
    }

    public Mono<Boolean> save(BoardBlockHistory boardBlockHistory) {
        return Mono.fromCallable(() -> boardBlockHistoryMapper.save(boardBlockHistory) > 0);
    }

    public Mono<Boolean> update(BoardBlockHistory boardBlockHistory) {
        return Mono.fromCallable(() -> boardBlockHistoryMapper.update(boardBlockHistory) > 0);
    }

    public Mono<Boolean> delete(long boardBlockHistoryPk) {
        return Mono.fromCallable(() -> boardBlockHistoryMapper.deleteByPk(boardBlockHistoryPk) > 0);
    }
}
