package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.mapper.BoardMapper;
import com.anamensis.server.resultMap.BoardResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper boardMapper;

    public Mono<Long> count(Board board) {
        return Mono.just(boardMapper.count(board));
    }

    public Flux<BoardResponse.List> findAll(Page page, Board board) {
        return Flux.fromIterable(boardMapper.findList(page, board))
                .map(BoardResponse.List::from);
    }

    public Mono<BoardResponse.Content> findByPk(long boardPk) {
        BoardResultMap.Board board = boardMapper.findByPk(boardPk)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
        return Mono.just(board)
                .map(BoardResponse.Content::from);
    }

    public Flux<BoardResponse.SummaryList> findByUserPk(long userPk) {
        return Flux.fromIterable(boardMapper.findByUserPk(userPk))
                .map(BoardResponse.SummaryList::from);
    }

    @Transactional
    public Mono<Board> save(Board board) {
        board.setCreateAt(LocalDateTime.now());
        return Mono.just(boardMapper.save(board))
                .onErrorMap(RuntimeException::new)
                .flatMap($ -> Mono.just(board));
    }

    @Transactional
    public Mono<Boolean> viewUpdateByPk(long boardPk) {
        return Mono.just(boardMapper.viewUpdateByPk(boardPk) == 1);
    }

    @Transactional
    public Mono<Boolean> disableByPk(long boardPk, long userPk) {
        return Mono.just(boardMapper.disableByPk(boardPk, userPk) == 1);
    }

    public Mono<Boolean> updateByPk(Board board) {
        return Mono.just(boardMapper.updateByPk(board) == 1);
    }
}
