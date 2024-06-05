package com.anamensis.server.service;

import com.anamensis.server.entity.BoardComment;
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

    public Flux<BoardCommentResultMap.BoardComment> findAllByBoardPk(long boardPk) {
        return Flux.fromIterable(boardCommentMapper.findAllByBoardPk(boardPk));
    }

    public Mono<Boolean> save(BoardComment boardComment) {
        return Mono.fromCallable(() -> boardCommentMapper.save(boardComment))
                .map(result -> result > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> delete(long id, String userId) {
        return Mono.fromCallable(() -> boardCommentMapper.delete(id, userId))
                .map(result -> result > 0)
                .onErrorReturn(false);
    }

}
