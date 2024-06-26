package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.BoardIndex;
import com.anamensis.server.entity.Member;
import com.anamensis.server.mapper.BoardIndexMapper;
import com.anamensis.server.mapper.BoardMapper;
import com.anamensis.server.resultMap.BoardCommentResultMap;
import com.anamensis.server.resultMap.BoardResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final BoardMapper boardMapper;

    private final BoardIndexMapper boardIndexMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    public Mono<Long> count(Board board) {
        return Mono.fromCallable(() -> boardMapper.count(board));
    }

    public Flux<BoardResponse.List> findAll(
        Page page,
        BoardRequest.Params params,
        Member member
    ) {
        return Flux.fromIterable(boardMapper.findList(page, params, member))
                .publishOn(Schedulers.boundedElastic())
                .map(BoardResponse.List::from);
    }

    public Flux<BoardResponse.List> findOnePage() {
        List<Object> list;

        if(!redisTemplate.hasKey("board:page:1")) {
            this.onePageCache(0);
        }

        try {
            list = redisTemplate.boundListOps("board:page:1").range(0, -1);
        } catch (Exception e) {
            this.onePageCache(0);
        }

        list = redisTemplate.boundListOps("board:page:1").range(0, -1);
        return Flux.fromIterable(list)
            .cast(BoardResponse.List.class);
    }


    public Mono<BoardResultMap.Board> findByPk(long boardPk) {
        return Mono.justOrEmpty(boardMapper.findByPk(boardPk))
                .log("boardMapper.findByPk")
                .switchIfEmpty(Mono.error(new RuntimeException("게시글이 없습니다.")));
    }

    public Flux<BoardResponse.SummaryList> findByMemberPk(long memberPk, Page page) {
        return Flux.fromIterable(boardMapper.findByMemberPk(memberPk, page))
                .map(BoardResponse.SummaryList::from);
    }

    public Mono<Board> save(Board board) {
        if(board.getTitle() == null || board.getTitle().isEmpty())
            return Mono.error(new RuntimeException("제목을 입력해주세요."));
        if(board.getContent() == null || board.getContent().isEmpty())
            return Mono.error(new RuntimeException("내용을 입력해주세요."));

        board.setCreateAt(LocalDateTime.now());
        board.setUpdateAt(LocalDateTime.now());
        return Mono.fromCallable(()-> boardMapper.save(board))
                .onErrorMap(RuntimeException::new)
                .flatMap($ -> Mono.just(board))
            .publishOn(Schedulers.boundedElastic())
            .doOnNext($ -> onePageCache(0));
    }

    public void saveIndex(long boardPk, String content) {
        BoardIndex boardIndex = new BoardIndex();
        boardIndex.setBoardId(boardPk);
        boardIndex.setContent(content);
        boardIndex.setCreatedAt(LocalDateTime.now());
        boardIndex.setUpdatedAt(LocalDateTime.now());
        boardIndexMapper.save(boardIndex);
    }

    public void updateIndex(long boardPk, String content) {
        BoardIndex boardIndex = new BoardIndex();
        boardIndex.setBoardId(boardPk);
        boardIndex.setContent(content);
        boardIndex.setUpdatedAt(LocalDateTime.now());

        try {
            int result = boardIndexMapper.update(boardIndex);
            if(result == 0) {
                saveIndex(boardPk, content);
            }
        } catch (Exception e) {
            saveIndex(boardPk, content);
        }
    }

    public void deleteIndex(long boardPk) {
        boardIndexMapper.delete(boardPk);
    }

    public void onePageCache(long id) {
        if(id > 0) {
            boolean isEmpty = redisTemplate.boundSetOps("board:page:1:ids").members()
                .stream()
                .map(o -> (Long) o)
                .filter(b -> b == id)
                .findFirst().isEmpty();

            if(isEmpty) return;
        }

        Page page = new Page();
        page.setPage(1);
        page.setSize(20);

        redisTemplate.delete("board:page:1:ids");
        redisTemplate.delete("board:page:1");

        this.findAll(page, new BoardRequest.Params(), new Member())
            .doOnNext(list -> {
                redisTemplate.boundSetOps("board:page:1:ids").add(list.getId());
                redisTemplate.boundListOps("board:page:1").rightPush(list);
            })
            .subscribe();
    }

    public Mono<Boolean> viewUpdateByPk(long boardPk) {
        return Mono.fromCallable(() -> boardMapper.viewUpdateByPk(boardPk) == 1)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> onePageCache(boardPk))
                .onErrorReturn(false);
    }

    public Mono<Boolean> disableByPk(long boardPk, long memberPk) {
        return Mono.just(boardMapper.disableByPk(boardPk, memberPk, LocalDateTime.now()) == 1)
                .onErrorReturn(false)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> onePageCache(boardPk));
    }

    public Mono<Boolean> updateByPk(Board board) {
        board.setUpdateAt(LocalDateTime.now());
        return Mono.fromCallable(() -> boardMapper.updateByPk(board) == 1)
                .onErrorReturn(false)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> onePageCache(board.getId()));
    }
}
