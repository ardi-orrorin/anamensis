package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.Category;
import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.BoardResultMap;
import com.fasterxml.jackson.databind.node.DecimalNode;
import com.fasterxml.jackson.datatype.jsr310.DecimalUtils;
import jakarta.validation.constraints.DecimalMax;
import org.json.JSONObject;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class BoardMapperTest {

    @SpyBean
    BoardMapper bm;

    @SpyBean
    MemberMapper mm;

    @SpyBean
    CategoryMapper cm;

    @Test
    @Order(1)
    @DisplayName("게시글 저장")
    void save() {

        Member member = mm.findMemberByUserId("d-member-1").orElseThrow();
        Category category = cm.selectById(1).orElseThrow();

        Board board = new Board();
        board.setMemberPk(member.getId());

        assertThrowsExactly(DataIntegrityViolationException.class, () -> bm.save(board));
        board.setTitle("게시글 제목");

        assertThrowsExactly(DataIntegrityViolationException.class, () -> bm.save(board));
        Map<String, Object> content = Map.of("content", "게시글 내용");

        board.setContent(new SerializedJSONObject(content));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bm.save(board));

        board.setCategoryPk(category.getId());
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bm.save(board));

        board.setCreateAt(LocalDateTime.now());
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bm.save(board));

        board.setUpdateAt(LocalDateTime.now());
        assertDoesNotThrow(() -> bm.save(board));

        board.setAdsense(false);
        assertDoesNotThrow(() -> bm.save(board));

        board.setViewCount(0);
        assertDoesNotThrow(() -> bm.save(board));

        board.setRate(0);
        assertEquals(1, bm.save(board));
    }

    @Test
    @Order(2)
    @DisplayName("게시글 목록 조회")
    void findList() {
        Page page = new Page();
        page.setPage(1);
        page.setSize(4);

        List<BoardResultMap.List> list = bm.findList(page, new BoardRequest.Params(), new Member());
        assertEquals(4, list.size());


        list.forEach(b -> {
            assertNotNull(b.getBoard());
            Board board = b.getBoard();
            assertNotNull(board.getId());
            assertNotNull(board.getMemberPk());
            assertNotNull(board.getCategoryPk());
            assertNotNull(board.getTitle());
            assertNotNull(board.getContent());
            assertNotNull(board.getCreateAt());
            assertNotNull(board.isAdsense());
            assertNotNull(board.getRate());
            assertNotNull(board.getViewCount());
            assertNotNull(board.isUse());

        });

        assertFalse(list.stream().anyMatch(b -> b.getBoard().getId() == 11));
        assertFalse(list.stream().anyMatch(b -> b.getBoard().getId() == 6));

        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 10));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 9));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 8));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 7));


        page.setPage(2);
        list = bm.findList(page, new BoardRequest.Params(), new Member());

        list.forEach(b -> {
            assertNotNull(b.getBoard());
            Board board = b.getBoard();
            assertNotNull(board.getId());
            assertNotNull(board.getMemberPk());
            assertNotNull(board.getCategoryPk());
            assertNotNull(board.getTitle());
            assertNotNull(board.getContent());
            assertNotNull(board.getCreateAt());
            assertNotNull(board.isAdsense());
            assertNotNull(board.getRate());
            assertNotNull(board.getViewCount());
            assertNotNull(board.isUse());

        });

        assertFalse(list.stream().anyMatch(b -> b.getBoard().getId() == 7));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 6));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 5));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 4));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 3));
        assertFalse(list.stream().anyMatch(b -> b.getBoard().getId() == 2));


        page.setPage(3);
        list = bm.findList(page, new BoardRequest.Params(), new Member());

        list.forEach(b -> {
            assertNotNull(b.getBoard());
            Board board = b.getBoard();
            assertNotNull(board.getId());
            assertNotNull(board.getMemberPk());
            assertNotNull(board.getCategoryPk());
            assertNotNull(board.getTitle());
            assertNotNull(board.getContent());
            assertNotNull(board.getCreateAt());
            assertNotNull(board.isAdsense());
            assertNotNull(board.getRate());
            assertNotNull(board.getViewCount());
            assertNotNull(board.isUse());

        });

        assertFalse(list.stream().anyMatch(b -> b.getBoard().getId() == 3));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 2));
        assertTrue(list.stream().anyMatch(b -> b.getBoard().getId() == 1));
        assertFalse(list.stream().anyMatch(b -> b.getBoard().getId() == 0));

    }

    @Test
    @Order(2)
    @DisplayName("게시글 조회")
    void findByPk() {
        assertFalse(bm.findByPk(111).isPresent());

        assertThrowsExactly(NoSuchElementException.class, () ->
            bm.findByPk(111).get()
        );

        assertTrue(bm.findByPk(1).isPresent());
        assertDoesNotThrow(()-> bm.findByPk(1).get());
        BoardResultMap.Board board = bm.findByPk(1).get();
        assertNotNull(board.getBoard());
        assertNotNull(board.getBoard().getId());
        assertNotNull(board.getBoard().getMemberPk());
        assertNotNull(board.getBoard().getCategoryPk());
        assertNotNull(board.getBoard().getTitle());
        assertNotNull(board.getBoard().getContent());
        assertNotNull(board.getBoard().getCreateAt());
        assertNotNull(board.getBoard().isAdsense());
        assertNotNull(board.getBoard().getRate());
        assertNotNull(board.getBoard().getViewCount());
        assertNotNull(board.getBoard().isUse());

        assertNotNull(board.getMember());
    }

    @Test
    @Order(3)
    @DisplayName("작성자 최근 5개 게시글 조회")
    @Disabled("레디스로 변경")
    void findByMemberPk() {
//        Member m1 = mm.findMemberByUserId("d-member-1").orElseThrow();
//        Member m10 = mm.findMemberByUserId("d-member-5").orElseThrow();
//
//        List<BoardResultMap.Board> list = bm.findByMemberPk(m1.getId());
//        assertFalse(list.isEmpty());
//
//        list.forEach(b -> {
//            assertNotNull(b.getBoard());
//            Board board = b.getBoard();
//            assertNotNull(board.getId());
//            assertNotNull(board.getMemberPk());
//            assertNotNull(board.getCategoryPk());
//            assertNotNull(board.getTitle());
//            assertNotNull(board.getContent());
//            assertNotNull(board.getCreateAt());
//            assertNotNull(board.isAdsense());
//            assertNotNull(board.getRate());
//            assertNotNull(board.getViewCount());
//            assertNotNull(board.isUse());
//        });
//
//        assertFalse(list.stream().anyMatch(b -> b.getId() == 6));
//        assertFalse(list.stream().anyMatch(b -> b.getId() == 5));
//
//        assertTrue(list.stream().anyMatch(b -> b.getId() == 1));
//        assertTrue(list.stream().anyMatch(b -> b.getId() == 2));
//        assertTrue(list.stream().anyMatch(b -> b.getId() == 3));
//        assertTrue(list.stream().anyMatch(b -> b.getId() == 4));
//
//
//        list = bm.findByMemberPk(m10.getId());
//        assertTrue(list.isEmpty());
    }

    @Test
    @Order(4)
    @DisplayName("게시글 수 조회")
    void count() {
        long count = bm.count(new Board());
        assertEquals(10, count);

        Member member = mm.findMemberByUserId("d-member-1").orElseThrow();
        Category category = cm.selectById(1).orElseThrow();

        Board board = new Board();
        board.setMemberPk(member.getId());
        board.setTitle("게시글 제목");
        Map<String, Object> content = Map.of("content", "게시글 내용");
        board.setContent(new SerializedJSONObject(content));
        board.setCategoryPk(category.getId());
        board.setCreateAt(LocalDateTime.now());
        board.setUpdateAt(LocalDateTime.now());
        board.setAdsense(false);
        board.setViewCount(0);
        board.setRate(0);
        bm.save(board);


        count = bm.count(new Board());
        assertEquals(11, count);

        bm.disableByPk(board.getId(), member.getId(), LocalDateTime.now());

        count = bm.count(new Board());
        assertEquals(10, count);


        Board param1 = new Board();
        param1.setTitle("제목1");
        count = bm.count(param1);
        assertEquals(2, count);

        param1.setTitle("제목2");
        count = bm.count(param1);
        assertEquals(1, count);
    }

    @Test
    @Order(5)
    @DisplayName("게시글 비활성화")
    void disableByPk() {
        assertTrue(bm.findByPk(1).isPresent());
        bm.disableByPk(1, 1, LocalDateTime.now());
        assertFalse(bm.findByPk(1).isPresent());

        assertTrue(bm.findByPk(5).isPresent());
        bm.disableByPk(5, 1, LocalDateTime.now());
        assertTrue(bm.findByPk(5).isPresent());

        bm.disableByPk(5, 2, LocalDateTime.now());
        assertFalse(bm.findByPk(5).isPresent());
    }

    @Test
    @Order(6)
    @DisplayName("조회수 증가")
    void viewUpdateByPk() {
        long v1 = bm.findByPk(1).orElseThrow().getBoard().getViewCount();
        bm.viewUpdateByPk(1);
        long v2 = bm.findByPk(1).orElseThrow().getBoard().getViewCount();
        assertEquals(v1 + 1, v2);

        bm.viewUpdateByPk(1);
        long v3 = bm.findByPk(1).orElseThrow().getBoard().getViewCount();

        assertEquals(v1 + 2, v3);
        assertEquals(v2 + 1, v3);

        bm.viewUpdateByPk(2);
        long v4 = bm.findByPk(2).orElseThrow().getBoard().getViewCount();

        assertNotEquals(v2, v4);
    }

    @Test
    @Order(7)
    @DisplayName("게시글 수정")
    void updateByPk() {
        Board b1 = bm.findByPk(1).orElseThrow().getBoard();
        b1.setId(1);
        b1.setTitle("수정된 제목");
        b1.getContent().put("content", "수정된 내용");

        assertEquals(1, bm.updateByPk(b1));
        Board b2 = bm.findByPk(1).orElseThrow().getBoard();

        assertEquals(b1.getTitle(), b2.getTitle());
        assertEquals(b1.getContent(), b2.getContent());
    }

    @Test
    @Order(8)
    @DisplayName("title 255자 제한 테스트")
    void titleLengthTest() {

        Member member = mm.findMemberByUserId("d-member-1").orElseThrow();
        Category category = cm.selectById(1).orElseThrow();

        Board board = new Board();
        board.setMemberPk(member.getId());
        Map<String, Object> content = Map.of("content", "게시글 내용");
        board.setContent(new SerializedJSONObject(content));
        board.setCategoryPk(category.getId());
        board.setCreateAt(LocalDateTime.now());
        board.setUpdateAt(LocalDateTime.now());
        board.setAdsense(false);
        board.setViewCount(0);
        board.setRate(0);


        board.setTitle("a".repeat(255));
        assertDoesNotThrow(() -> bm.save(board));

        board.setTitle("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bm.save(board));
    }

    @Test
    @Order(9)
    @DisplayName("viewCount 최대치 테스트")
    void viewCountMaxTest() {

        Member member = mm.findMemberByUserId("d-member-1").orElseThrow();
        Category category = cm.selectById(1).orElseThrow();

        Board board = new Board();
        board.setMemberPk(member.getId());
        Map<String, Object> content = Map.of("content", "게시글 내용");
        board.setTitle("게시글 제목");
        board.setContent(new SerializedJSONObject(content));
        board.setCategoryPk(category.getId());
        board.setCreateAt(LocalDateTime.now());
        board.setUpdateAt(LocalDateTime.now());
        board.setAdsense(false);
        board.setRate(0);

        board.setViewCount(0);
        assertDoesNotThrow(() -> bm.save(board));

        board.setViewCount(Long.MAX_VALUE);
        assertDoesNotThrow(() -> bm.save(board));
    }

    @Test
    @Order(10)
    @DisplayName("rate 최대치 테스트")
    void rateMaxTest() {

        Member member = mm.findMemberByUserId("d-member-1").orElseThrow();
        Category category = cm.selectById(1).orElseThrow();

        Board board = new Board();
        board.setMemberPk(member.getId());
        Map<String, Object> content = Map.of("content", "게시글 내용");
        board.setTitle("게시글 제목");
        board.setContent(new SerializedJSONObject(content));
        board.setCategoryPk(category.getId());
        board.setCreateAt(LocalDateTime.now());
        board.setUpdateAt(LocalDateTime.now());
        board.setAdsense(false);
        board.setViewCount(0);

        board.setRate(0);
        assertDoesNotThrow(() -> bm.save(board));

        board.setRate(Long.MAX_VALUE);
        assertDoesNotThrow(() -> bm.save(board));
    }

}