package com.anamensis.server.service;

import com.anamensis.server.dto.CacheExpire;
import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.SelectAnswerQueueDto;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.entity.*;
import com.anamensis.server.mapper.BoardIndexMapper;
import com.anamensis.server.mapper.BoardMapper;
import com.anamensis.server.provider.MailProvider;
import com.anamensis.server.resultMap.BoardResultMap;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private static final String BOARD_PK_KEY = "board:pk:%s";
    private static final CacheExpire boardExpire = new CacheExpire(5, TimeUnit.MINUTES);

    private final BoardMapper boardMapper;

    private final RedisTemplate<String, Object> redisTemplate;

    private final Set<SystemSetting> systemSettings;

    private final MailProvider mailProvider;

    public Flux<BoardResponse.List> findAll(
        Page page,
        BoardRequest.Params params,
        Member member
    ) {

        List<BoardResultMap.List> list = params.getIsSelf() != null && params.getIsSelf()
            ? boardMapper.findIsSelf(page, params, member)
            : boardMapper.findList(page, params, member);

        return Flux.fromIterable(list)
            .publishOn(Schedulers.boundedElastic())
            .map(l -> BoardResponse.List.from(l, member));
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
            .switchIfEmpty(Mono.error(new RuntimeException("게시글을 찾을 수 없습니다.")));
    }

    public Mono<Boolean> updateIsBlockedByPk(long boardPk, boolean isBlocked) {
        return Mono.fromCallable(()-> boardMapper.updateIsBlockedByPk(boardPk, isBlocked) > 0)
            .publishOn(Schedulers.boundedElastic())
            .doOnNext($ -> updateCacheBoard(boardPk).subscribe());
    }

    public Mono<BoardResultMap.Board> cacheFindByPk(long boardPk) {
        String key = String.format(BOARD_PK_KEY, boardPk);

        return Mono.fromCallable(()-> redisTemplate.hasKey(key))
            .flatMap(b -> {
                if(!b) {
                    BoardResultMap.Board board = boardMapper.findByPk(boardPk)
                        .orElseThrow(()-> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

                    redisTemplate.boundValueOps(key).set(board, boardExpire.timeout(), boardExpire.timeUnit());
                }

                return Mono.fromCallable(()-> redisTemplate.boundValueOps(key).get());
            })
            .cast(BoardResultMap.Board.class);
    }

    public Mono<Boolean> refreshCacheBoard(long boardPk) {
        String key = String.format(BOARD_PK_KEY, boardPk);

        if(!redisTemplate.hasKey(key)) return Mono.just(false);

        redisTemplate.boundValueOps(key).expire(boardExpire.timeout(), boardExpire.timeUnit());
        return Mono.just(true);

    }

    private Mono<Boolean> updateCacheBoard(long boardPk) {
        String key = String.format(BOARD_PK_KEY, boardPk);
        if(redisTemplate.hasKey(key)) {
            BoardResultMap.Board board = boardMapper.findByPk(boardPk)
                .orElseThrow(()-> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

            redisTemplate.boundValueOps(key).set(board, boardExpire.timeout(), boardExpire.timeUnit());
        }
        return Mono.just(true)
            .onErrorReturn(false);
    }

    public Flux<BoardResponse.SummaryList> findSummaryList(long memberPk) {

         return Mono.fromCallable(() -> redisTemplate.boundListOps("board:summary:member:" + memberPk)
             .range(0, -1))
             .flatMap(list -> {
                 if(list == null || list.isEmpty()) {
                     return updateSummaryList(memberPk)
                         .mapNotNull(b -> redisTemplate.boundListOps("board:summary:member:" + memberPk).range(0, -1));
                 }

                 return Mono.just(list);
             })
             .flatMapMany(Flux::fromIterable)
             .cast(BoardResponse.SummaryList.class)
             .publishOn(Schedulers.boundedElastic())
             .onErrorResume(e -> {
                 if(!e.getMessage().equals("Cannot deserialize")) return Mono.error(e);
                 return updateSummaryList(memberPk)
                     .mapNotNull(b -> redisTemplate.boundListOps("board:summary:member:" + memberPk).range(0, -1))
                     .flatMapMany(Flux::fromIterable)
                     .cast(BoardResponse.SummaryList.class);
             })
             .publishOn(Schedulers.boundedElastic());
    }


    @SneakyThrows
    public Mono<Board> save(Board board) {
        if(board.getTitle() == null || board.getTitle().isEmpty())
            return Mono.error(new RuntimeException("제목을 입력해주세요."));
        if(board.getContent() == null || board.getContent().getJSONArray("list").isNull(0))
            return Mono.error(new RuntimeException("내용을 입력해주세요."));

        board.setCreateAt(LocalDateTime.now());
        board.setUpdateAt(LocalDateTime.now());

        return Mono.fromCallable(()-> boardMapper.save(board))
                .onErrorMap(RuntimeException::new)
                .flatMap($ -> Mono.just(board))
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> updateCaches(0, board.getMemberPk()).subscribe());
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
                .doOnNext($ -> updateCaches(boardPk, memberPk).subscribe());
    }

    public Mono<Boolean> updateByPk(Board board) {
        board.setUpdateAt(LocalDateTime.now());
        return Mono.fromCallable(() -> boardMapper.updateByPk(board) == 1)
                .onErrorReturn(false)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> updateCaches(board.getId(), board.getMemberPk()).subscribe());
    }

    public Mono<Boolean> addSelectAnswerQueue(SelectAnswerQueueDto saqdto) {
        return Mono.fromCallable(()-> redisTemplate.boundSetOps("select:answer:queue").add(saqdto))
                .flatMap($ -> Mono.just(true))
                .onErrorReturn(false)
                .publishOn(Schedulers.boundedElastic());
    }

    // fixme: email subject 내용 수정
    public Mono<Boolean> selectedAnswerAlert(long boardPk, String toEmail) {
        SystemSetting smtp = systemSettings.stream()
            .filter(s -> s.getKey() == SystemSettingKey.SMTP)
            .findFirst().orElse(null);

        if(smtp == null || smtp.getValue().getBoolean("enabled")) return Mono.just(false);

        MailProvider.MailMessage message = new MailProvider.MailMessage(
            toEmail,
            "답변이 선택되었습니다.",
            "게시글 번호 " + boardPk + "의 답변이 선택되었습니다."
        );

        return mailProvider.sendMessage(message)
            .onErrorReturn(false);
    }

    public Mono<List<BoardResponse.Notice>> findNotice() {

        return Flux.fromIterable(redisTemplate.boundListOps("board:notice").range(0, -1))
            .cast(BoardResponse.Notice.class)
            .collectList();
    }


    private Mono<Boolean> updateCaches(long id, long memberPk) {
        return updateSummaryList(memberPk)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> updateNoticeCache().subscribe())
                .publishOn(Schedulers.boundedElastic())
                .doOnNext($ -> onePageCache(id))
                .doOnNext($ -> updateCacheBoard(id).subscribe());
    }

    private Mono<Boolean> updateNoticeCache() {
        return Mono.fromCallable(() -> redisTemplate.delete("board:notice"))
                .flatMapIterable($ -> boardMapper.findNotice())
                .map(BoardResponse.Notice::from)
                .flatMap(b -> {
                    redisTemplate.boundListOps("board:notice").rightPush(b);
                    return Mono.just(true);
                })
                .then(Mono.defer(() ->
                    Mono.just(redisTemplate.hasKey("board:notice"))
                ));
    }

    private Mono<Boolean> updateSummaryList(long memberPk) {
        Page page = new Page();
        page.setPage(1);
        page.setSize(5);

        return Mono.fromCallable(() -> redisTemplate.delete("board:summary:member:" + memberPk))
            .flatMapIterable($ -> boardMapper.findByMemberPk(memberPk, page))
            .map(BoardResponse.SummaryList::from)
            .publishOn(Schedulers.boundedElastic())
            .doOnNext(list -> {
                redisTemplate.boundListOps("board:summary:member:" + memberPk)
                    .rightPush(list);
            })
            .then(Mono.defer(() -> {
                redisTemplate.boundListOps("board:summary:member:" + memberPk)
                    .expire(15, TimeUnit.DAYS);

                return Mono.just(redisTemplate.hasKey("board:summary:member:" + memberPk));
                }
            ));
    }
}
