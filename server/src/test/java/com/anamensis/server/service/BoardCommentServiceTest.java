package com.anamensis.server.service;

import com.anamensis.server.entity.BoardComment;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class BoardCommentServiceTest {

    @SpyBean
    BoardCommentService bcs;

    @Test
    @Order(1)
    @DisplayName("게시글 번호로 댓글 조회")
    void findAllByBoardPk() {
        StepVerifier.create(bcs.findAllByBoardPk(1))
                .expectNextCount(6)
                .verifyComplete();


        StepVerifier.create(bcs.findAllByBoardPk(1))
                .assertNext(boardComment -> {
                    BoardComment bc = boardComment.getBoardComment();
                    assertEquals(1, bc.getId());
                    assertEquals(1, bc.getBoardPk());
                    assertEquals("테스트 댓글1", bc.getContent());
                    assertNull(bc.getParentPk());
                    assertNull(bc.getBlockSeq());
                })
                .assertNext(boardComment -> {
                    BoardComment bc = boardComment.getBoardComment();
                    assertEquals(2, bc.getId());
                    assertEquals(1, bc.getBoardPk());
                    assertEquals("테스트 댓글2", bc.getContent());
                    assertNull(bc.getParentPk());
                })
                .expectNextCount(4)
                .verifyComplete();

        StepVerifier.create(bcs.findAllByBoardPk(2))
                .expectNextCount(4)
                .verifyComplete();


        StepVerifier.create(bcs.findAllByBoardPk(2))
                .assertNext(boardComment -> {
                    BoardComment bc = boardComment.getBoardComment();
                    assertEquals(7, bc.getId());
                    assertEquals(2, bc.getBoardPk());
                    assertEquals("테스트 댓글7", bc.getContent());
                    assertNull(bc.getParentPk());

                })
                .assertNext(boardComment -> {
                    BoardComment bc = boardComment.getBoardComment();
                    assertEquals(8, bc.getId());
                    assertEquals(2, bc.getBoardPk());
                    assertEquals("테스트 댓글8", bc.getContent());
                    assertNull(bc.getParentPk());
                })
                .expectNextCount(1)
                .assertNext(boardComment -> {
                    BoardComment bc = boardComment.getBoardComment();
                    assertEquals(10, bc.getId());
                    assertEquals(2, bc.getBoardPk());
                    assertEquals("테스트 댓글10", bc.getContent());
                    assertNull(bc.getParentPk());
                    assertNotNull(bc.getBlockSeq());
                })
                .verifyComplete();


        StepVerifier.create(bcs.findAllByBoardPk(3))
                .expectNextCount(0)
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("댓글 저장")
    void save() {
        BoardComment bc = new BoardComment();
        bc.setBoardPk(1);
        bc.setContent("테스트 댓글7");
        bc.setUserId("d-member-1");
        bc.setCreateAt(LocalDateTime.now());

        StepVerifier.create(bcs.save(bc))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bcs.findAllByBoardPk(1))
                .expectNextCount(7)
                .verifyComplete();

        StepVerifier.create(bcs.findAllByBoardPk(1))
                .expectNextCount(6)
                .assertNext(boardComment -> {
                    BoardComment bc1 = boardComment.getBoardComment();
                    assertEquals(1, bc1.getBoardPk());
                    assertEquals("테스트 댓글7", bc1.getContent());
                    assertNull(bc1.getParentPk());
                })
                .verifyComplete();

        bc.setCreateAt(null);

        StepVerifier.create(bcs.save(bc))
                .expectNext(false)
                .verifyComplete();

        bc.setCreateAt(LocalDateTime.now());
        bc.setUserId(null);

        StepVerifier.create(bcs.save(bc))
                .expectNext(false)
                .verifyComplete();

        bc.setUserId("d-member-5");
        bc.setContent(null);
        StepVerifier.create(bcs.save(bc))
                .expectNext(false)
                .verifyComplete();

        bc.setContent("테스트 댓글7");
        bc.setBoardPk(99);
        StepVerifier.create(bcs.save(bc))
                .expectNext(false)
                .verifyComplete();

        bc.setBoardPk(2);
        StepVerifier.create(bcs.save(bc))
                .expectNext(true)
                .verifyComplete();

        bc.setBlockSeq(1);
        StepVerifier.create(bcs.save(bc))
                .expectNext(true)
                .verifyComplete();

        bc.setBlockSeq(null);
        StepVerifier.create(bcs.save(bc))
                .expectNext(true)
                .verifyComplete();
    }

    @Test
    @DisplayName("댓글 삭제")
    @Order(3)
    void delete() {
        StepVerifier.create(bcs.delete(1, "d-member-1"))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bcs.findAllByBoardPk(1))
                .expectNextCount(5)
                .verifyComplete();

        StepVerifier.create(bcs.delete(1, "d-member-1"))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bcs.delete(99, "d-member-1"))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bcs.delete(2, "d-member-2"))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bcs.findAllByBoardPk(1))
                .expectNextCount(4)
                .verifyComplete();

    }
}