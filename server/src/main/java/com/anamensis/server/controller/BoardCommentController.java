package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.request.BoardCommentRequest;
import com.anamensis.server.dto.response.BoardCommentResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@RequestMapping("/api/board/comments")
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;
    private final PointHistoryService pointHistoryService;
    private final UserService userService;
    private final PointService pointService;
    private final TableCodeService tableCodeService;

    @PublicAPI
    @GetMapping("")
    public Mono<PageResponse<BoardCommentResponse.Comment>> list(
            @RequestParam long boardPk,
            Page page,
            @AuthenticationPrincipal UserDetails user
    ) {

        String userId = user != null ? user.getUsername() : null;

        Mono<Integer> count = boardCommentService.count(boardPk);

        return boardCommentService.findAllByBoardPk(boardPk, page)
                .map(board -> BoardCommentResponse.Comment.fromResultMap(board, userId))
                .collectList()
                .zipWith(count)
                .map(t -> {
                    page.setTotal(t.getT2());
                    return new PageResponse<>(
                            page,
                            t.getT1()
                        );
                    }
                );
    }

    @PostMapping("")
    public Mono<Boolean> save(
            @Valid @RequestBody BoardCommentRequest.Save comment,
            @AuthenticationPrincipal UserDetails user
    ) {
        BoardComment bc = BoardCommentRequest.Save.toEntity(comment, user);

        Mono<Member> member = userService.findUserByUserId(user.getUsername())
                .subscribeOn(Schedulers.boundedElastic());

        Mono<PointCode> pointCode = pointService.selectByIdOrTableName("board_comment")
                .subscribeOn(Schedulers.boundedElastic());

        Mono<TableCode> tableCode = tableCodeService.findByIdByTableName(0, "board_comment")
                .subscribeOn(Schedulers.boundedElastic());

        Mono<Boolean> insertBoardComment = boardCommentService.save(bc)
                .subscribeOn(Schedulers.boundedElastic());

        return insertBoardComment
                .doOnNext($ -> {
                    Mono.zip(pointCode, tableCode, member)
                        .publishOn(Schedulers.boundedElastic())
                            .doOnNext(t -> {
                                userService.updatePoint(t.getT3().getId(), (int) t.getT1().getPoint())
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .subscribe();

                                PointHistory ph = new PointHistory();
                                ph.setMemberPk(t.getT3().getId());
                                ph.setPointCodePk(t.getT1().getId());
                                ph.setTableCodePk(t.getT2().getId());
                                ph.setCreateAt(bc.getCreateAt());
                                ph.setTableRefPk(bc.getId());

                                pointHistoryService.insert(ph)
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .subscribe();
                            })
                            .subscribe();
                });
    }

    @DeleteMapping("/{id}")
    public Mono<Boolean> delete(
            @PathVariable long id,
            @AuthenticationPrincipal UserDetails user
    ) {
        return boardCommentService.delete(id, user.getUsername());
    }

}
