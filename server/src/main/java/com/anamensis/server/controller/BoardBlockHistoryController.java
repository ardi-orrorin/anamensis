package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.request.BoardBlockHistoryRequest;
import com.anamensis.server.dto.response.BoardBlockHistoryResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.Member;
import com.anamensis.server.service.BoardBlockHistoryService;
import com.anamensis.server.service.BoardService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/board-block-history")
public class BoardBlockHistoryController {

    private final BoardBlockHistoryService boardBlockHistoryService;
    private final BoardService boardService;
    private final UserService userService;
    private final VirtualThreadTaskExecutor executor;

    @GetMapping("")
    public Mono<PageResponse<BoardBlockHistoryResponse.List>> findByAll(
        Page page,
        @AuthenticationPrincipal UserDetails user
    ) {

        Mono<Member> member = userService.findUserByUserId(user.getUsername())
            .subscribeOn(Schedulers.fromExecutor(executor))
            .share();


        Mono<Long> count = member
            .subscribeOn(Schedulers.fromExecutor(executor))
            .flatMap(u -> boardBlockHistoryService.count(u.getId()));

        Mono<List<BoardBlockHistoryResponse.List>> result = member
            .subscribeOn(Schedulers.fromExecutor(executor))
            .flatMapMany(u -> boardBlockHistoryService.findByMemberPk(u.getId(), page))
            .map(BoardBlockHistoryResponse.List::from)
            .collectList();


        return Mono.zip(result, count)
                .flatMap(t -> {
                    page.setTotal(t.getT2().intValue());
                    PageResponse<BoardBlockHistoryResponse.List> response = new PageResponse<>(page, t.getT1());
                    return Mono.just(response);
                });
    }


    @GetMapping("{id}")
    public Mono<BoardBlockHistoryResponse.Detail> findByPk(
        @PathVariable("id") long boardBlockHistoryPk
    ) {
        return boardBlockHistoryService.findByPk(boardBlockHistoryPk)
                .map(BoardBlockHistoryResponse.Detail::from);
    }

    @AdminAPI
    @PostMapping("")
    public Mono<StatusResponse> save(
        @RequestBody BoardBlockHistoryRequest.Save request
    ) {
        return boardService.findByPk(request.getBoardPk())
                .doOnNext(b -> request.setMemberPk(b.getBoard().getMemberPk()))
                .flatMap(u -> boardBlockHistoryService.save(request.toEntity()))
                .flatMap(bool -> {
                    StatusResponse response = StatusResponse.builder()
                        .status(bool ? StatusType.SUCCESS : StatusType.FAIL)
                        .message(bool ? "정상적으로 블록처리 되었습니다." : "블록 처리에 실패하였습니다.")
                        .build();
                    return Mono.just(response);
                });
    }

    @PutMapping("")
    public Mono<StatusResponse> update(
        @RequestBody BoardBlockHistoryRequest.Update request
    ) {
        return boardBlockHistoryService.update(request.toEntity())
                .flatMap(bool -> {
                    StatusResponse response = StatusResponse.builder()
                        .status(bool ? StatusType.SUCCESS : StatusType.FAIL)
                        .message(bool ? "정상적으로 수정되었습니다." : "수정에 실패하였습니다.")
                        .build();
                    return Mono.just(response);
                });
    }
}
