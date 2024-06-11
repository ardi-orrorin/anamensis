package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.mapper.BoardMapper;
import com.anamensis.server.resultMap.BoardCommentResultMap;
import com.anamensis.server.resultMap.BoardResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final BoardMapper boardMapper;

    public Mono<Long> count(Board board) {
        return Mono.fromCallable(() -> boardMapper.count(board));
    }

    public Flux<BoardResponse.List> findAll(Page page, Board board) {
        return Flux.fromIterable(boardMapper.findList(page, board))
                .publishOn(Schedulers.boundedElastic())
                .map(BoardResponse.List::from);
    }

    public Mono<BoardResultMap.Board> findByPk(long boardPk) {
        return Mono.justOrEmpty(boardMapper.findByPk(boardPk))
                .switchIfEmpty(Mono.error(new RuntimeException("게시글이 없습니다.")));
    }

    public Flux<BoardResponse.SummaryList> findByMemberPk(long memberPk) {
        return Flux.fromIterable(boardMapper.findByMemberPk(memberPk))
                .map(BoardResponse.SummaryList::from);
    }

    public Mono<Board> save(Board board) {
        if(board.getTitle() == null || board.getTitle().isEmpty())
            return Mono.error(new RuntimeException("제목을 입력해주세요."));
        if(board.getContent() == null || board.getContent().isEmpty())
            return Mono.error(new RuntimeException("내용을 입력해주세요."));

        board.setCreateAt(LocalDateTime.now());
        return Mono.fromCallable(()-> boardMapper.save(board))
                .onErrorMap(RuntimeException::new)
                .flatMap($ -> Mono.just(board));
    }

    public Mono<Boolean> viewUpdateByPk(long boardPk) {
        return Mono.fromCallable(() -> boardMapper.viewUpdateByPk(boardPk) == 1)
                .onErrorReturn(false);
    }

    public Mono<Boolean> disableByPk(long boardPk, long memberPk) {
        return Mono.just(boardMapper.disableByPk(boardPk, memberPk) == 1)
                .onErrorReturn(false);
    }

    public Mono<Boolean> updateByPk(Board board) {
        return Mono.fromCallable(() -> boardMapper.updateByPk(board) == 1)
                .onErrorReturn(false);
    }
}
