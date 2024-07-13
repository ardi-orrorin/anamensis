package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.BoardComment;
import com.anamensis.server.exception.AuthorizationException;
import com.anamensis.server.mapper.BoardCommentMapper;
import com.anamensis.server.resultMap.BoardCommentResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class BoardCommentService {

    private final BoardCommentMapper boardCommentMapper;

    public Mono<Integer> count(long boardPk) {
        return Mono.just(boardCommentMapper.count(boardPk));
    }

    public Flux<BoardCommentResultMap.List> findAllByBoardPk(long boardPk, Page page) {
        return Flux.fromIterable(boardCommentMapper.findAllByBoardPk(boardPk, page));
    }

    public Mono<Boolean> save(BoardComment boardComment) {
        return Mono.fromCallable(() -> boardCommentMapper.save(boardComment) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> delete(long id, String userId) {
        return Mono.fromCallable(() -> boardCommentMapper.delete(id, userId) > 0)
                .onErrorReturn(false);
    }

    public Mono<BoardComment> findById(long id) {
        return Mono.justOrEmpty(boardCommentMapper.findById(id))
            .switchIfEmpty(Mono.error(() -> new RuntimeException("board comment not found")));

    }
}
