package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.Board;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BoardMapperTest {

    @SpyBean
    BoardMapper boardMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(BoardMapperTest.class);

    @Test
    @DisplayName("게시글 저장")
    void save() {
        Map<String, Object> depth1 = new HashMap<>();
        depth1.put("key1", "value1");
        depth1.put("key2", "value2");

        Map<String, Object> depth2 = new HashMap<>();
        depth2.put("key3", "value3");
        depth2.put("key4", "value4");
        depth1.put("depth2", depth2);

        Board board = new Board();
        board.setCategoryPk(2L);
        board.setUserPk(1L);
        board.setTitle("title");
        board.setContent(depth1);
        board.setRate(0L);
        board.setViewCount(0L);
        board.setCreateAt(LocalDateTime.now());
        board.setAdsense(false);
        board.setUse(false);

        assertEquals(1, boardMapper.save(board));
        log.info("{}", board);

        board.setTitle(null);
        assertThrows(DataIntegrityViolationException.class, () -> boardMapper.save(board));

    }
    @Test
    @DisplayName("게시글 none title")
    void saveNoneTitle() {
        Board board = new Board();
        board.setCategoryPk(2L);
        board.setUserPk(1L);
        board.setRate(0L);
        board.setViewCount(0L);
        board.setCreateAt(LocalDateTime.now());
        board.setAdsense(false);
        board.setUse(false);

        assertThrows(DataIntegrityViolationException.class, () -> boardMapper.save(board));
    }

    @Test
    void find() {
        Page page = new Page();
        page.setPage(1);
        page.setSize(10);

        Board board = new Board();
        board.setCategoryPk(2L);
        board.setUserPk(1L);
        board.setTitle("title");

        assertDoesNotThrow(() -> boardMapper.findList(page, board));
        boardMapper.findList(page, board).forEach(board1 -> {
            log.info("{}", board1);
        });
    }

    @Test
    void count() {
        Board board = new Board();
        board.setCategoryPk(2L);
        board.setUserPk(1L);
        board.setTitle("title");

        log.info("{}", boardMapper.count(board));

        assertNotEquals(0, boardMapper.count(board));
        assertDoesNotThrow(() -> boardMapper.count(board));
    }

    @Test
    @DisplayName("게시글 삭제")
    void disableByPk() {
        long pk = 4;
        long userPk = 1;
        assertEquals(1, boardMapper.disableByPk(pk, userPk));
        assertDoesNotThrow(() -> boardMapper.disableByPk(pk, userPk));
    }

    @Test
    @DisplayName("없는 게시글 삭제 불가")
    void noneDisableByPk() {
        long pk = 1;
        long userPk = 1;
        assertEquals(0, boardMapper.disableByPk(pk, userPk));
        assertDoesNotThrow(() -> boardMapper.disableByPk(pk, userPk));
    }

    @Test
    @DisplayName("게시글 조회")
    void findByPk() {
        log.info("{}", boardMapper.findByPk(1));
        assertNotNull(boardMapper.findByPk(1));
        assertDoesNotThrow(() -> boardMapper.findByPk(1));

    }


    @Test
    @DisplayName("사용자별 최근 게시글 5개 조회")
    void findByUserPk() {
        long userPk = 1;

        assertDoesNotThrow(() -> boardMapper.findByUserPk(userPk));

        boardMapper.findByUserPk(userPk).forEach(board -> {
            log.info("{}", board);
            Board test = board.getBoard();

            assertNotNull(test.getId());
            assertNotNull(test.getUserPk());
            assertNotNull(test.getViewCount());
            assertNotNull(test.getContent());
            assertNotNull(test.getRate());
            assertNotNull(test.getCreateAt());
            assertNotNull(test.getCategoryPk());


            assertNull(board.getUsers().getName());
            assertNull(board.getUsers().getEmail());
            assertNull(board.getUsers().getPwd());
            assertNull(board.getFile().getFileName());
            assertNull(board.getFile().getFilePath());
        });
    }
}