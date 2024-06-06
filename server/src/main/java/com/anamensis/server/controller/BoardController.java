package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.response.BoardCommentResponse;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.service.BoardCommentService;
import com.anamensis.server.service.BoardService;
import com.anamensis.server.service.RateService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@RequestMapping("api/boards")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;
    private final RateService rateService;
    private final BoardCommentService boardCommentService;

    @PublicAPI
    @GetMapping("")
    public Mono<PageResponse<BoardResponse.List>> findAll(
        Page page,
        Board board
    ) {

        Mono<List<BoardResponse.List>> list = boardService.findAll(page, board)
                .flatMap(b -> rateService.countRate(b.getId())
                        .doOnNext(b::setRate)
                        .map($ -> b)
                )
                .collectList();

        Mono<Long> count = boardService.count(board)
                .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(list, count)
                .map(t -> {
                    page.setTotal(t.getT2().intValue());
                    return PageResponse.<BoardResponse.List>builder()
                                    .content(t.getT1())
                                    .page(page)
                                    .build();
                });
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
    public Mono<List<BoardResponse.SummaryList>> findByMemberPk(
        @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                .flatMapMany(u -> boardService.findByMemberPk(u.getId()))
                .flatMap(b -> rateService.countRate(b.getId())
                    .doOnNext(b::setRate)
                    .map($ -> b)
                )
                .collectList();

    }

    @PostMapping("")
    public Mono<Board> save(
        @RequestBody Board board,
        @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                .doOnNext(u -> board.setMemberPk(u.getId()))
                .flatMap(u -> boardService.save(board));
    }

    @PutMapping("/{id}")
    public Mono<StatusResponse> updateByPk(
        @PathVariable(name = "id") long boardPk,
        @RequestBody Board board,
        @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
                .doOnNext(u -> {
                    board.setMemberPk(u.getId());
                    board.setId(boardPk);
                })
                .flatMap(u -> boardService.updateByPk(board))
                .map(result -> {
                    StatusResponse.StatusResponseBuilder sb = StatusResponse.builder();
                    return result ? sb.status(StatusType.SUCCESS)
                                      .message("게시글이 수정 되었습니다.")
                                      .build()
                                  : sb.status(StatusType.FAIL)
                                      .message("게시글 수정에 실패하였습니다.")
                                      .build();
                });
    }


    @DeleteMapping("/{id}")
    public Mono<StatusResponse> disableByPk(
        @PathVariable(name = "id") long boardPk,
        @AuthenticationPrincipal UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
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


    @PublicAPI
    @GetMapping("test/{id}")
    public Mono<BoardResponse.ExContent> findByPkTest(
            @PathVariable(name = "id") long boardPk
    ) {

        Mono<BoardResponse.Content> content = boardService.findByPk(boardPk)
                .flatMap(b -> rateService.countRate(b.getId())
                        .doOnNext(b::setRate)
                        .map($ -> b)
                )
                .subscribeOn(Schedulers.boundedElastic());

        Mono<Boolean> viewUpdate = boardService.viewUpdateByPk(boardPk)
                .subscribeOn(Schedulers.boundedElastic());


        Mono<List<BoardCommentResponse.Comment>> comments = boardCommentService.findAllByBoardPk(boardPk)
                .map(board -> BoardCommentResponse.Comment.fromResultMap(board, null))
                .collectList()
                .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(content, viewUpdate, comments)
                .map(tuple ->
                   BoardResponse.ExContent.from(tuple.getT1(), tuple.getT3())
                );


    }


}
