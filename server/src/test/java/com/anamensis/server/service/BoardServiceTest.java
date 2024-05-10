package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.Board;
import jdk.jfr.Description;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("local")
class BoardServiceTest {

    @SpyBean
    BoardService boardService;

    @Test
    @DisplayName("게시글 수 조회")
    void count() {
        Board board = new Board();
        boardService.count(board)
                .doOnNext(b -> {
                    assertNotNull(b);
                    assertTrue(b >= 0);
                })
                .doOnError(e -> {
                    fail();
                })
                .subscribe();
    }

    @Test
    @DisplayName("게시글 전체 조회 page")
    void findAll() {
        Board board = new Board();

        Page page = new Page();
        page.setPage(1);
        page.setSize(10);
        boardService.findAll(page, board)
                .doOnNext(Assertions::assertNotNull)
                .log()
                .doOnError(e -> {
                    fail();
                })
                .subscribe();
    }

    @Test
    @DisplayName("게시글 조회 성공")
    void findByPk() {
        long boardPk = 8L;
        boardService.findByPk(boardPk)
                .switchIfEmpty(Mono.error(new RuntimeException("게시글이 없습니다.")))
                .doOnNext(Assertions::assertNotNull)
                .doOnNext(b -> {
                    assertNotNull(b.getCreatedAt());
                    assertNotNull(b.getWriter());
                    assertTrue(b.getId() > 0);
                })
                .doOnError(e -> {
                    fail();
                })
                .subscribe();
    }

    @Test
    @DisplayName("게시글 조회 실패")
    void findByPkError() {
        long boardPk = 10L;
        assertThrows(RuntimeException.class, () -> {
            boardService.findByPk(boardPk)
                    .subscribe();
        });
    }

    @Test
    @DisplayName("게시글 저장 성공")
    void saveSuccess() {
        Board board = new Board();
        board.setCategoryPk(2);
        board.setTitle("게시글 제목");
        board.setContent(null);
        board.setUserPk(1);
        board.setCreateAt(LocalDateTime.now());

        Map<String, Object> map = Map.of(
                "board", "sdfsdf"
        );
        board.setContent(map);

        boardService.save(board)
                .doOnNext($-> {
                    assertTrue(board.getId() > 0);
                })
                .subscribe();
    }

    @Test
    @DisplayName("게시글 저장 실패")
    void saveFail() {
        Board board = new Board();
        board.setCategoryPk(2);
        board.setTitle(null);
        board.setContent(null);
        board.setUserPk(1);
        board.setCreateAt(LocalDateTime.now());

        assertThrows(RuntimeException.class, () -> {
            boardService.save(board)
                    .subscribe();
        });

        board.setTitle("게시글 제목");

        assertThrows(RuntimeException.class, () -> {
            boardService.save(board)
                    .subscribe();
        });
    }

    @Test
    @DisplayName("게시글 비활성화 성공")
    void disableByPk() {
        // 게시글이 있을 때
        boardService.disableByPk(10, 1)
                .log()
                .doOnNext(Assertions::assertTrue)
                .doOnError(e -> {
                    fail();
                })
                .subscribe();

        // 게시글이 비활성화 되었을 때
        boardService.disableByPk(6, 1)
                .log()
                .doOnNext(Assertions::assertTrue)
                .doOnError(e -> {
                    fail();
                })
                .subscribe();
    }

    @Test
    @DisplayName("게시글 비활성화 실패")
    @Description("게시글이 없을 때")
    void disableByPkError() {

        boardService.disableByPk(1, 1)
                .doOnNext(Assertions::assertFalse)
                .subscribe();

        boardService.disableByPk(0, 1)
                .doOnNext(Assertions::assertFalse)
                .subscribe();
    }
}