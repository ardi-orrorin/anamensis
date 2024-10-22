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
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.connection.ReactiveListCommands;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.io.PipedReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

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
    private final BoardIndexService boardIndexService;
    private final ScheduleAlertService scheduleAlertService;
    private final Map<SystemSettingKey, SystemSetting> systemSettings;

    private boolean enableRedis() {
        return systemSettings.get(SystemSettingKey.REDIS)
            .getValue().getBoolean("enabled");
    }

    @PublicAPI
    @GetMapping("")
    public Mono<PageResponse<BoardResponse.List>> findAll(
        Page page,
        BoardRequest.Params params,
        @AuthenticationPrincipal UserDetails user,
        @RequestHeader(name = "Cache-Data", required = false) boolean cache
    ) {

        Flux<BoardResponse.List> list;

        if(cache && enableRedis()) {
            list = boardService.findOnePage();
        } else {
            list = user == null
                ? boardService.findAll(page, params, new Member())
                : userService.findUserByUserId(user.getUsername())
                    .flatMapMany(u -> boardService.findAll(page, params, u));
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

        Mono<BoardResultMap.Board> content = user == null
            ? boardService.findByPk(boardPk)
            : member.flatMap(u -> boardService.cacheFindByPk(boardPk));

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


    @PublicAPI
    @GetMapping("/ref/{id}")
    public Mono<BoardResponse.RefContent> findRefByPk(
        @PathVariable(name = "id") long boardPk,
        @AuthenticationPrincipal UserDetails user
    ) {
        return boardService.cacheFindByPk(boardPk)
            .flatMap(board -> {
                if(Objects.isNull(user)) {
                    return Mono.just(BoardResponse.RefContent.from(board, null));
                }

                return userService.findUserByUserId(user.getUsername())
                    .flatMap(u -> Mono.just(BoardResponse.RefContent.from(board, u)));
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

    @PublicAPI
    @GetMapping("notice")
    public Mono<List<BoardResponse.Notice>> findNotice() {
        return boardService.findNotice();
    }

    @PostMapping("")
    public Mono<Board> save(
        @RequestBody BoardRequest.Create board,
        @AuthenticationPrincipal UserDetails user
    ) {
        if(board.getCategoryPk() == 1) {
            if(user.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ADMIN")))
                return Mono.error(new RuntimeException("공지사항은 관리자 권한이 필요합니다."));
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
                        .doOnNext(t -> {

                            PointHistory ph = new PointHistory();
                            ph.setMemberPk(b.getMemberPk());
                            ph.setPointCodePk(t.getT1().getId());
                            ph.setCreatedAt(b.getCreateAt());
                            ph.setTableCodePk(t.getT2().getId());
                            ph.setTableRefPk(t.getT1().getId());
                            ph.setValue(t.getT1().getPoint());

                            userService.updatePoint(b.getMemberPk(), t.getT1().getPoint())
                                    .flatMap($ -> userService.addUserInfoCache(user.getUsername()))
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();

                            pointHistoryService.insert(ph)
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();

                            if(board.getUploadFiles() != null && board.getUploadFiles().length > 0) {
                                fileService.updateByTableRefPk(board.getUploadFiles(), "board", b.getId())
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();
                            }

                            board.setId(b.getId());
                            boardIndexService.save(board.toEntity())
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe();

                        })
                        .subscribe();
                })
                .doOnNext(b -> {
                    if(b.getCategoryPk() != 3) return;
                    findPoint(new JSONObject(board.getContent()))
                        .doOnNext(p ->
                            userService.subtractPoint(b.getMemberPk(), p.point)
                                .subscribe()
                        )
                        .doOnNext(p -> {
                            insertQnAPointHistory(b.getMemberPk(),(int) -p.point)
                                .subscribe();
                        })
                        .doOnNext($ -> {
                            userService.addUserInfoCache(user.getUsername())
                                .subscribe();
                        })
                        .subscribeOn(Schedulers.boundedElastic())
                        .subscribe();
                })
                .doOnNext(b -> {
                    if(b.getCategoryPk() != 6) return;
                    findSchedule(new JSONObject(board.getContent()), user.getUsername(), b.getId())
                        .flatMap(scheduleAlertService::saveAll)
                        .subscribe();
                });
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

                board.setId(boardPk);

                boardIndexService.update(board.toEntity())
                    .subscribe();

                if(board.getRemoveFiles().length == 0) return;

                Arrays.stream(board.getRemoveFiles())
                        .forEach(fileUrl -> fileService.deleteByUri(fileUrl)
                                .subscribeOn(Schedulers.boundedElastic())
                                .subscribe()
                        );
            })
            .doOnNext(r -> {
                if(r.getStatus() != StatusType.SUCCESS) return;
                if(board.getCategoryPk() != 6) return;
                findSchedule(new JSONObject(board.getContent()), user.getUsername(), boardPk)
                    .flatMap(scheduleAlerts ->
                        scheduleAlertService.updateAll(scheduleAlerts, boardPk, user.getUsername())
                    )
                    .subscribe();
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

                findPoint(new JSONObject(board.getContent()))
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
                    // fixme: selectedAnswerAlert 실행안됨
                    .flatMap(t -> boardService.selectedAnswerAlert(boardPk, commentMemberAtomic.get().getEmail()))
                    .onErrorReturn(false)
                    .subscribe();
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

                    boardIndexService.delete(boardPk)
                        .subscribe();

                    userService.addUserInfoCache(user.getUsername())
                        .subscribe();
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
                ph.setCreatedAt(LocalDateTime.now());
                ph.setTableCodePk(t.getT2().getId());
                ph.setTableRefPk(t.getT1().getId());
                ph.setValue(point);

                return pointHistoryService.insert(ph)
                    .flatMap($ -> Mono.just(t));
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

    private Mono<PointComment> findPoint(JSONObject content) {

        JSONObject extraValue = getExtraValue(content);

        long selectCommentId = extraValue.get("selectId").equals("")
            ? 0
            : Long.parseLong(extraValue.get("selectId").toString());

        long point = Long.parseLong(extraValue.get("point").toString());

        PointCommentExtraValueStatus state = PointCommentExtraValueStatus.valueOf(extraValue.get("state").toString().toUpperCase());

        return Mono.just(new PointComment(selectCommentId, point, state));
    }

    private Mono<List<ScheduleAlert>> findSchedule(JSONObject content, String userId, long boardPk) {
        JSONArray list = content.getJSONArray("list");

        List<ScheduleAlert> scheduleAlerts = new ArrayList<>();

        for (int i = 0; i < list.length(); i++) {
            JSONObject obj = list.getJSONObject(i);

            if(obj.isNull("extraValue")) continue;
            JSONObject extraValue = obj.getJSONObject("extraValue");

            if(extraValue.isNull("code")) continue;
            String code = extraValue.getString("code");

            if(!"00411".equals(code)) continue;
            ScheduleAlert scheduleAlert = new ScheduleAlert();

            LocalDateTime alertTime = extraValue.getBoolean("allDay")
                ? LocalDate.parse(extraValue.getString("start")).atStartOfDay()
                : LocalDateTime.parse(extraValue.getString("start"));

            scheduleAlert.setBoardId(boardPk);
            scheduleAlert.setUserId(userId);
            scheduleAlert.setHashId(extraValue.getString("id"));
            scheduleAlert.setTitle(extraValue.getString("title"));
            scheduleAlert.setAlertTime(alertTime);
            scheduleAlerts.add(scheduleAlert);
        }

        return Mono.just(scheduleAlerts);
    }

    private JSONObject getExtraValue(JSONObject content) {
        JSONArray list = content.getJSONArray("list");
        if(list.isNull(0)) throw new RuntimeException("객체를 찾을 수 없습니다.");
        if(list.getJSONObject(0).isNull("extraValue")) throw new RuntimeException("객체를 찾을 수 없습니다.");
        return list.getJSONObject(0).getJSONObject("extraValue");
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
