package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.service.BoardService;
import com.anamensis.server.service.RateService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@RequestMapping("api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;
    private final RateService rateService;


    @PublicAPI
    @GetMapping("")
    public Mono<PageResponse<BoardResponse.List>> findAll(
        Page page,
        Board board
    ) {
        return boardService.findAll(page, board)
                .flatMap(b -> rateService.countRate(b.getId())
                    .doOnNext(b::setRate)
                    .map($ -> b)
                )
            .collectList()
            .flatMap(list ->
                boardService.count(board)
                    .doOnNext(count -> page.setTotal(count.intValue()))
                    .map($ ->PageResponse.<BoardResponse.List>builder()
                            .content(list)
                            .page(page)
                            .build()
                    )
            );
    }

    @PublicAPI
    @GetMapping("/{id}")
    public Mono<BoardResponse.Content> findByPk(
            @PathVariable(name = "id") long boardPk
    ) {
        return boardService.findByPk(boardPk)
                .flatMap(b -> rateService.countRate(b.getId())
                    .doOnNext(b::setRate)
                    .map($ -> b)
                )
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(b -> boardService.viewUpdateByPk(boardPk)
                    .subscribe()
                );
    }

    @GetMapping("summary")
    public Mono<List<BoardResponse.SummaryList>> findByUserPk(
        @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(userDetails -> userService.findUserByUserId(userDetails.getUsername()))
                .flatMapMany(u -> boardService.findByUserPk(u.getId()))
                .flatMap(b -> rateService.countRate(b.getId())
                    .doOnNext(b::setRate)
                    .map($ -> b)
                )
                .collectList();

    }

    @PostMapping("")
    public Mono<Board> save(
        @RequestBody Board board,
        @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(userDetails -> userService.findUserByUserId(userDetails.getUsername()))
                .doOnNext(u -> board.setUserPk(u.getId()))
                .flatMap(u -> boardService.save(board));
    }

    @PutMapping("/{id}")
    public Mono<StatusResponse> updateByPk(
        @PathVariable(name = "id") long boardPk,
        @RequestBody Board board,
        @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(userDetails -> userService.findUserByUserId(userDetails.getUsername()))
                .doOnNext(u -> {
                    board.setUserPk(u.getId());
                    board.setId(boardPk);
                })
                .flatMap(u -> boardService.updateByPk(board))
                .map(result -> {
                    StatusResponse.StatusResponseBuilder sb = StatusResponse.builder();
                    if (result) {
                        sb.status(StatusType.SUCCESS)
                          .message("게시글이 수정 되었습니다.");
                    } else {
                        sb.status(StatusType.FAIL)
                          .message("게시글 수정에 실패하였습니다.");
                    }
                    return sb.build();
                });
    }


    @DeleteMapping("/{id}")
    public Mono<StatusResponse> disableByPk(
        @PathVariable(name = "id") long boardPk,
        @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(userDetails -> userService.findUserByUserId(userDetails.getUsername()))
                .flatMap(u -> boardService.disableByPk(boardPk, u.getId()))
                .map(result -> {
                    StatusResponse.StatusResponseBuilder sb = StatusResponse.builder();
                    if (result) {
                        sb.status(StatusType.SUCCESS)
                          .message("게시글이 삭제 되었습니다.");
                    } else {
                        sb.status(StatusType.FAIL)
                          .message("게시글 삭제에 실패하였습니다.");
                    }
                    return sb.build();
                });
    }


}
