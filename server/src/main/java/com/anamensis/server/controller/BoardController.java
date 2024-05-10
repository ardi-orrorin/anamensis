package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.service.BoardService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    private final UserService userService;

    @PublicAPI
    @GetMapping("")
    public Mono<PageResponse<BoardResponse.List>> findAll(
        Page page,
        Board board
    ) {
        return boardService.findAll(page, board)
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
        return boardService.findByPk(boardPk);
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


    @DeleteMapping("/{id}")
    public Mono<StatusResponse> disableByPk(
        @PathVariable(name = "id") long boardPk,
        @AuthenticationPrincipal Mono<UserDetails> user
    ) {
        return user
                .flatMap(userDetails -> userService.findUserByUserId(userDetails.getUsername()))
                .flatMap(u -> boardService.disableByPk(boardPk, u.getId()))
                .map(result -> {
                    if (result) {
                        return StatusResponse.builder()
                                .status(StatusType.SUCCESS)
                                .message("게시글이 삭제 되었습니다.")
                                .build();
                    } else {
                        return StatusResponse.builder()
                                .status(StatusType.FAIL)
                                .message("게시글 삭제에 실패하였습니다.")
                                .build();
                    }
                });
    }


}
