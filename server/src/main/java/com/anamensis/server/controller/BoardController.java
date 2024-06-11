package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.resultMap.BoardResultMap;
import com.anamensis.server.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.util.List;

@RestController
@RequestMapping("api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;
    private final RateService rateService;
    private final PointHistoryService pointHistoryService;
    private final PointService pointService;
    private final TableCodeService tableCodeService;

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
                .subscribeOn(Schedulers.boundedElastic())
                .collectList();

//        Mono<Long> count = boardService.count(board)
//                .subscribeOn(Schedulers.boundedElastic());

        return list.map(l -> {
//                    page.setTotal(t.getT2().intValue());
                    return new PageResponse<>(page, l);
                });
    }

    @PublicAPI
    @GetMapping("/{id}")
    public Mono<BoardResponse.Content> findByPk(
            @PathVariable(name = "id") long boardPk,
            @AuthenticationPrincipal UserDetails user
    ) {

        Mono<Member> member = user == null ? Mono.just(new Member())
                                           : userService.findUserByUserId(user.getUsername())
                                                .subscribeOn(Schedulers.boundedElastic());

        Mono<BoardResultMap.Board> content = boardService.findByPk(boardPk)
            .subscribeOn(Schedulers.boundedElastic());

        Mono<Long> count = rateService.countRate(boardPk)
            .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(content, member)
            .flatMap(t -> {
                BoardResultMap.Board board = t.getT1();
                Member m = t.getT2();
                return Mono.just(BoardResponse.Content.from(board, m));
            })
            .zipWith(count)
            .doOnNext(t -> t.getT1().setRate(t.getT2()))
            .map(Tuple2::getT1)
            .doOnNext($ -> {
                boardService.viewUpdateByPk(boardPk)
                    .subscribeOn(Schedulers.boundedElastic())
                    .subscribe();
            });

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

        Mono<PointCode> pointCode = pointService.selectByIdOrTableName("board")
                .subscribeOn(Schedulers.boundedElastic());

        Mono<TableCode> tableCode = tableCodeService.findByIdByTableName(0, "board")
                .subscribeOn(Schedulers.boundedElastic());

        Mono<Board> insertBoard = userService.findUserByUserId(user.getUsername())
                .flatMap(u -> {
                    board.setMemberPk(u.getId());
                    return boardService.save(board);
                })
                .subscribeOn(Schedulers.boundedElastic());

        return insertBoard
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(b -> {
                    Mono.zip(pointCode, tableCode)
                        .doOnNext(t -> {
                            userService.updatePoint(b.getMemberPk(), (int) t.getT1().getPoint())
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();

                            PointHistory ph = new PointHistory();
                            ph.setMemberPk(b.getMemberPk());
                            ph.setPointCodePk(t.getT2().getId());
                            ph.setCreateAt(b.getCreateAt());
                            ph.setTableCodePk(t.getT2().getId());
                            ph.setTableRefPk(t.getT1().getId());

                            pointHistoryService.insert(ph)
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();
                        })
                        .subscribe();
                });
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


//    @PublicAPI
//    @GetMapping("test/{id}")
//    public Mono<BoardResponse.ExContent> findByPkTest(
//            @PathVariable(name = "id") long boardPk
//    ) {
//
//        Mono<BoardResponse.Content> content = boardService.findByPk(boardPk)
//                .flatMap(b -> rateService.countRate(b.getId())
//                        .doOnNext(b::setRate)
//                        .map($ -> b)
//                )
//                .subscribeOn(Schedulers.boundedElastic());
//
//        Mono<Boolean> viewUpdate = boardService.viewUpdateByPk(boardPk)
//                .subscribeOn(Schedulers.boundedElastic());
//
//
//        Mono<List<BoardCommentResponse.Comment>> comments = boardCommentService.findAllByBoardPk(boardPk)
//                .map(board -> BoardCommentResponse.Comment.fromResultMap(board, null))
//                .collectList()
//                .subscribeOn(Schedulers.boundedElastic());
//
//        return Mono.zip(content, viewUpdate, comments)
//                .map(tuple ->
//                   BoardResponse.ExContent.from(tuple.getT1(), tuple.getT3())
//                );
//    }


}
