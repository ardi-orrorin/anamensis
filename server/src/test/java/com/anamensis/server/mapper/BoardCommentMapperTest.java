package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.BoardComment;
import com.anamensis.server.resultMap.BoardCommentResultMap;
import com.anamensis.server.resultMap.BoardResultMap;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class BoardCommentMapperTest {

    @SpyBean
    BoardCommentMapper bcm;

    @Test
    @Order(1)
    @DisplayName("게시글의 댓글을 조회한다.")
    void findAllByBoardPk() {
        Page page = new Page();
        page.setPage(1);
        page.setSize(10);
        List<BoardCommentResultMap.List> result = bcm.findAllByBoardPk(1L, page);

        assertEquals(6, result.size());
        result.stream().reduce((acc, next) -> {
            assertTrue(acc.getId() < next.getId());
            return next;
        });

        IntStream.range(0, result.size()).forEach(i -> {
            assertEquals(1 + i, result.get(i).getId());
        });

        assertTrue(result.stream().anyMatch(bc -> bc.getBoardComment().getContent().equals("테스트 댓글4")));
        assertTrue(result.stream().anyMatch(bc -> bc.getBoardComment().getContent().equals("테스트 댓글3")));
        assertTrue(result.stream().anyMatch(bc -> bc.getBoardComment().getContent().equals("테스트 댓글2")));
        assertTrue(result.stream().anyMatch(bc -> bc.getBoardComment().getContent().equals("테스트 댓글1")));
        assertTrue(result.stream().anyMatch(bc -> bc.getBoardComment().getContent().equals("테스트 댓글5")));

        List<BoardCommentResultMap.List> result1 = bcm.findAllByBoardPk(2L, page);

        assertEquals(4, result1.size());
        result1.stream().reduce((acc, next) -> {
            assertTrue(acc.getId() < next.getId());
            return next;
        });

        IntStream.range(0, result1.size()).forEach(i -> {
            assertEquals(7 + i, result1.get(i).getId());
        });

        assertTrue(result1.stream().anyMatch(bc -> bc.getBoardComment().getContent().equals("테스트 댓글10")));
    }

    @Test
    @Order(2)
    @DisplayName("게시글의 댓글을 추가한다.")
    void save() {
        BoardComment bc = new BoardComment();
        bc.setBoardPk(1L);
        bc.setContent("테스트 댓글11");
        bc.setUserId("d-member-5");
        bc.setCreateAt(LocalDateTime.now());


        assertEquals(1, bcm.save(bc));


        BoardComment bc1 = new BoardComment();

        bc1.setBoardPk(2L);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bcm.save(bc1));

        bc1.setUserId("d-member-5");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bcm.save(bc1));

        bc1.setContent("테스트 댓글12");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bcm.save(bc1));

        bc1.setCreateAt(LocalDateTime.now());
        assertDoesNotThrow(() -> bcm.save(bc1));

        bc1.setBlockSeq("1111-1");
        assertDoesNotThrow(() -> bcm.save(bc1));

        bc1.setParentPk(null);
        assertDoesNotThrow(() -> bcm.save(bc1));

        bc1.setContent(null);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bcm.save(bc1));
        bc1.setContent("테스트 댓글 12");

        bc1.setUserId(null);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bcm.save(bc1));
        bc1.setUserId("d-member-5");

        bc1.setBoardPk(900L);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> bcm.save(bc1));


        bc1.setBoardPk(3L);
        assertDoesNotThrow(() -> bcm.save(bc1));
    }

    @Test
    @Order(3)
    @DisplayName("게시글의 댓글을 삭제한다.")
    void delete() {

        assertEquals(1, bcm.delete(1L, "d-member-1"));

        assertEquals(0, bcm.delete(2L, "d-member-1"));
        assertEquals(1, bcm.delete(2L, "d-member-2"));

        assertEquals(0, bcm.delete(99L, "d-member-1"));
        assertEquals(0, bcm.delete(99L, "d-member-1"));


    }
}