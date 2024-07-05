package com.anamensis.server.controller;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.SelectAnswerQueueDto;
import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.exception.AuthorizationException;
import com.anamensis.server.resultMap.BoardResultMap;
import com.anamensis.server.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

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
    private final FileService fileService;
    private final BoardCommentService boardCommentService;
    private final MemberConfigSmtpService memberConfigSmtpService;

    @PublicAPI
    @GetMapping("")
    public Mono<PageResponse<BoardResponse.List>> findAll(
        Page page,
        BoardRequest.Params params,
        @AuthenticationPrincipal UserDetails user
    ) {

        Flux<BoardResponse.List> list;

        boolean condition = user == null
            && page.getPage() == 1
            && page.getSize() == 20
            && params.getCategoryPk() == 0
            && params.getType() == null
            && params.getValue() == null
            && !params.getIsSelf();

        if(condition) {
            list = boardService.findOnePage();
        } else {
            list = (user != null)
                ? userService.findUserByUserId(user.getUsername())
                    .flatMapMany(u -> boardService.findAll(page, params, u))
                : boardService.findAll(page, params, new Member());
        }

        return list
            .flatMap(b -> rateService.countRate(b.getId())
                .doOnNext(b::setRate)
                .map($ -> b)
            )
            .subscribeOn(Schedulers.boundedElastic())
            .collectList()
            .map(l -> new PageResponse<>(page, l));
    }

    @PublicAPI
    @GetMapping("/{id}")
    public Mono<BoardResponse.Content> findByPk(
            @PathVariable(name = "id") long boardPk,
            @AuthenticationPrincipal UserDetails user
    ) {

        Mono<Member> member = user == null
            ? Mono.just(new Member())
            : userService.findUserByUserId(user.getUsername())
                .subscribeOn(Schedulers.boundedElastic())
                .share();

        Mono<BoardResultMap.Board> content = (user == null)
            ? boardService.findByPk(boardPk)
            : member.flatMap(u -> boardService.findByPk(boardPk));

        Mono<Long> count = rateService.countRate(boardPk)
            .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(content, member)
            .flatMap(t -> {
                BoardResultMap.Board board = t.getT1();
                Member m = t.getT2();

                if(!board.getBoard().getIsPublic() && m.getId() != board.getBoard().getMemberPk()) {
                    return Mono.error(new AuthorizationException("비공개 게시글입니다.", HttpStatus.FORBIDDEN));
                }

                if(m.getName() == null &&  board.getBoard().isMembersOnly()) {
                    return Mono.error(new AuthorizationException("로그인이 필요한 게시글입니다.", HttpStatus.UNAUTHORIZED));
                }

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
                .flatMapMany(u -> boardService.findSummaryList(u.getId()))
                .flatMap(b -> rateService.countRate(b.getId())
                    .doOnNext(b::setRate)
                    .map($ -> b)
                )
                .collectList();
    }


    @PublicAPI
    @GetMapping("summary/{userId}")
    public Mono<List<BoardResponse.SummaryList>> findByMemberId(
        @PathVariable(name = "userId") String userId
    ) {
        return userService.findUserByUserId(userId)
            .flatMapMany(u -> boardService.findSummaryList(u.getId()))
            .collectList();
    }

    @PostMapping("")
    public Mono<Board> save(
        @RequestBody BoardRequest.Create board,
        @AuthenticationPrincipal UserDetails user
    ) {
        if(board.getCategoryPk() == 1) {
            if(!user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN")))
                return Mono.error(new RuntimeException("권한이 없습니다."));
        }

        Mono<PointCode> pointCode = pointService.selectByIdOrTableName("board")
                .subscribeOn(Schedulers.boundedElastic());

        Mono<TableCode> tableCode = tableCodeService.findByIdByTableName(0, "board")
                .share()
                .subscribeOn(Schedulers.boundedElastic());

        Mono<Board> insertBoard = userService.findUserByUserId(user.getUsername())
                .flatMap(u -> {

                    board.setMemberPk(u.getId());
                    return boardService.save(board.toEntity());
                })
                .subscribeOn(Schedulers.boundedElastic());

        return insertBoard
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(b -> {
                    Mono.zip(pointCode, tableCode)
                        .publishOn(Schedulers.boundedElastic())
                        .doOnNext(t -> {
                            userService.updatePoint(b.getMemberPk(), (int) t.getT1().getPoint())
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();

                            PointHistory ph = new PointHistory();
                            ph.setMemberPk(b.getMemberPk());
                            ph.setPointCodePk(t.getT1().getId());
                            ph.setCreateAt(b.getCreateAt());
                            ph.setTableCodePk(t.getT2().getId());
                            ph.setTableRefPk(t.getT1().getId());

                            pointHistoryService.insert(ph)
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();

                            if(board.getUploadFiles() != null && board.getUploadFiles().length > 0) {
                                fileService.updateByTableRefPk(board.getUploadFiles(), "board", b.getId())
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();
                            }

                            boardService.saveIndex(b.getId(), board.getSearchText());
                        })
                        .subscribe();
                })
                .doOnNext(b -> {
                    if(b.getCategoryPk() != 3) return;
                    findPoint(board.getContent())
                        .doOnNext(p ->
                            userService.subtractPoint(b.getMemberPk(), p.point)
                                .subscribe()
                        )
                        .doOnNext(p -> {
                            insertQnAPointHistory(b.getMemberPk(),(int) -p.point)
                                .subscribe();
                        })
                        .subscribeOn(Schedulers.boundedElastic())
                        .subscribe();
                })
            ;
    }

    @PutMapping("/{id}")
    public Mono<StatusResponse> update(
        @PathVariable(name = "id") long boardPk,
        @RequestBody BoardRequest.Create board,
        @AuthenticationPrincipal UserDetails user
    ) {
        return updateByPk(boardPk, board, user)
            .publishOn(Schedulers.boundedElastic())
            .doOnNext(r -> {
                if(r.getStatus() != StatusType.SUCCESS) return;

                boardService.updateIndex(boardPk, board.getSearchText());

                if(board.getRemoveFiles().length == 0) return;

                Arrays.stream(board.getRemoveFiles())
                        .forEach(fileUrl -> fileService.deleteByUri(fileUrl)
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe()
                        );
            });
    }

    @PutMapping("select-answer/{id}")
    public Mono<StatusResponse> selectAnswer (
        @PathVariable(name = "id") long boardPk,
        @RequestBody BoardRequest.Create board,
        @AuthenticationPrincipal UserDetails user
    ) {
        return updateByPk(boardPk, board, user)
            .publishOn(Schedulers.boundedElastic())
            .doOnNext(r -> {
                if(r.getStatus() != StatusType.SUCCESS) return;

                AtomicReference<PointComment> pointCommentAtomic = new AtomicReference<>();
                AtomicReference<Member> commentMemberAtomic = new AtomicReference<>();

                findPoint(board.getContent())
                    .doOnNext(pointCommentAtomic::set)
                    .flatMap(point ->
                        boardCommentService.findById(point.selectCommentId)
                            .flatMap(bc -> userService.findUserByUserId(bc.getUserId()))
                            .doOnNext(commentMemberAtomic::set)
                            .flatMap(m ->
                                userService.updatePoint(m.getId() , pointCommentAtomic.get().point)
                            )
                    )
                    .flatMap(p ->
                        insertQnAPointHistory(commentMemberAtomic.get().getId(),(int) pointCommentAtomic.get().point)
                    )
                    .flatMap(t ->
                        memberConfigSmtpService.selectByUserPk(commentMemberAtomic.get().getId())
                            .next()
                            .flatMap(mcs -> {
                                if(mcs == null) return Mono.just(false);
                                SelectAnswerQueueDto saqdto = new SelectAnswerQueueDto();
                                saqdto.setBoardPk(boardPk);
                                saqdto.setBoardTitle(board.getTitle());
                                saqdto.setPoint((int) pointCommentAtomic.get().point);
                                saqdto.setSmtpHost(mcs.getHost());
                                saqdto.setSmtpPort(mcs.getPort());
                                saqdto.setSmtpUser(mcs.getUsername());
                                saqdto.setSmtpPassword(mcs.getPassword());
                                return boardService.addSelectAnswerQueue(saqdto);
                            })
                            .onErrorReturn(false)

                    )
                    .subscribe();

            });
    }

    private Mono<Tuple2<PointCode, TableCode>> insertQnAPointHistory(long memberPk, int point) {
        Mono<PointCode> qnaPointCode = pointService.selectByIdOrTableName("q&a")
            .share()
            .subscribeOn(Schedulers.boundedElastic());

        Mono<TableCode> tableCode = tableCodeService.findByIdByTableName(0, "board")
            .share()
            .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(qnaPointCode, tableCode)
            .publishOn(Schedulers.boundedElastic())
            .flatMap(t -> {
                PointHistory ph = new PointHistory();
                ph.setMemberPk(memberPk);
                ph.setPointCodePk(t.getT1().getId());
                ph.setCreateAt(LocalDateTime.now());
                ph.setTableCodePk(t.getT2().getId());
                ph.setTableRefPk(t.getT1().getId());
                ph.setValue(point);

                return pointHistoryService.insert(ph)
                    .flatMap($ -> Mono.just(t));
            });
    }

    @DeleteMapping("/{id}")
    public Mono<StatusResponse> disableByPk(
        @PathVariable(name = "id") long boardPk,
        @AuthenticationPrincipal UserDetails user
    ) {
        AtomicReference<Board> boardAtomic = new AtomicReference<>();

        return boardService.findByPk(boardPk)
                .doOnNext(b -> boardAtomic.set(b.getBoard()))
                .flatMap($ -> userService.findUserByUserId(user.getUsername()))
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
                })
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(r -> {
                    if(r.getStatus() != StatusType.SUCCESS) return;
                    fileService.findByTableNameAndTableRefPk("board", boardPk)
                            .flatMap(f -> {
                                long[] ids = f.stream().mapToLong(File::getId).toArray();
                                return fileService.deleteByPks(ids);
                            })
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();

                    boardService.deleteIndex(boardPk);
                })
                .doOnNext(r -> {
                    if(r.getStatus() != StatusType.SUCCESS) return;
                    if(boardAtomic.get().getCategoryPk() != 3) return;
                    findPoint(boardAtomic.get().getContent())
                        .flatMap(p -> {
                            if(p.state == PointCommentExtraValueStatus.COMPLETED) return Mono.just(p);
                            return userService.updatePoint(boardAtomic.get().getMemberPk(), p.point)
                                .flatMap($ -> insertQnAPointHistory(boardAtomic.get().getMemberPk(),(int) p.point));
                        })
                        .subscribe();
                });
    }
    
    private Mono<StatusResponse> updateByPk(
        long boardPk,
        BoardRequest.Create board,
        UserDetails user
    ) {
        return userService.findUserByUserId(user.getUsername())
            .doOnNext(u -> {
                board.setMemberPk(u.getId());
                board.setId(boardPk);
            })
            .flatMap(u -> boardService.updateByPk(board.toEntity()))
            .map(result -> {
                StatusResponse.StatusResponseBuilder sb = StatusResponse.builder();
                return result
                    ? sb.status(StatusType.SUCCESS)
                        .message("게시글이 수정 되었습니다.")
                        .build()
                    : sb.status(StatusType.FAIL)
                        .message("게시글 수정에 실패하였습니다.")
                        .build();
            });
    }

    private Mono<PointComment> findPoint(Map<String, Object> content) {
        List<Map<String, Object>> list = (List<Map<String, Object>>) content.get("list");
        if(Objects.isNull(list)) return Mono.error(new RuntimeException("객체를 찾을 수 없습니다."));

        Map<String, Object> extraValue = (Map<String, Object>) list.get(0).get("extraValue");
        if(Objects.isNull(extraValue)) return Mono.error(new RuntimeException("객체를 찾을 수 없습니다."));

        long selectCommentId = extraValue.get("selectId") == ""
            ? 0
            : Long.parseLong(extraValue.get("selectId").toString());

        long point = Long.parseLong(extraValue.get("point").toString());

        PointCommentExtraValueStatus state = PointCommentExtraValueStatus.valueOf(extraValue.get("state").toString().toUpperCase());

        return Mono.just(new PointComment(selectCommentId, point, state));
    }

    private record PointComment(
        long selectCommentId,
        long point,

        PointCommentExtraValueStatus state
    ) {}

    private enum PointCommentExtraValueStatus {
        WAIT, COMPLETED
    }
}
