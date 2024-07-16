package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.SelectAnswerQueueDto;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.BoardResultMap;
import org.json.JSONObject;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
//@ActiveProfiles("test")
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class BoardServiceTest {

    @SpyBean
    BoardService bs;

    Logger log = org.slf4j.LoggerFactory.getLogger(CategoryServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("게시글 갯수 조회 테스트")
    @Disabled("사용안함")
    void count() {
//        Board b = new Board();
//
//        StepVerifier.create(bs.count(b))
//                .expectNext(10L)
//                .verifyComplete();
//
//        b.setTitle("4");
//        StepVerifier.create(bs.count(b))
//                .expectNext(1L)
//                .verifyComplete();
//
//        b.setTitle("제목1");
//        StepVerifier.create(bs.count(b))
//                .expectNext(2L)
//                .verifyComplete();
//
//        b.setCategoryPk(2);
//        StepVerifier.create(bs.count(b))
//                .expectNext(0L)
//                .verifyComplete();
//
//        b.setTitle(null);
//        b.setCategoryPk(1);
//        StepVerifier.create(bs.count(b))
//                .expectNext(10L)
//                .verifyComplete();

    }

    @Test
    @Order(2)
    @DisplayName("모든 게시글 조회 테스트")
    void findAll() {
        Page page = new Page();
        BoardRequest.Params b = new BoardRequest.Params();
        page.setSize(6);
        page.setPage(1);

        StepVerifier.create(bs.findAll(page, b, new Member()))
                .expectNextCount(6)
                .verifyComplete();

        StepVerifier.create(bs.findAll(page, b, new Member()))
                .assertNext(list -> {
                    assertEquals(10, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(9, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(8, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(7, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(6, list.getId());
                })
                .expectNextCount(1)
                .verifyComplete();

        page.setPage(2);
        StepVerifier.create(bs.findAll(page, b, new Member()))
                .expectNextCount(4)
                .verifyComplete();

        StepVerifier.create(bs.findAll(page, b, new Member()))
                .assertNext(list -> {
                    assertEquals(4, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(3, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(2, list.getId());
                })
                .assertNext(list -> {
                    assertEquals(1, list.getId());
                })
                .verifyComplete();


        b.setType("title");
        b.setValue("제목1");
        page.setPage(2);
        StepVerifier.create(bs.findAll(page, b, new Member()))
                .expectNextCount(0)
                .verifyComplete();


        page.setPage(1);
        StepVerifier.create(bs.findAll(page, b, new Member()))
                .expectNextCount(2)
                .verifyComplete();


    }

    @Test
    @Order(3)
    @DisplayName("게시글 조회 테스트")
    void findByPk() {
        StepVerifier.create(bs.findByPk(1))
                .assertNext(content -> {
                    assertEquals(1, content.getId());
                    assertEquals("테스트 제목1", content.getBoard().getTitle());
                })
                .verifyComplete();


        StepVerifier.create(bs.findByPk(10))
                .assertNext(content -> {
                    assertEquals(10, content.getId());
                    assertEquals("테스트 제목10", content.getBoard().getTitle());
                })
                .verifyComplete();

        StepVerifier.create(bs.findByPk(11))
                .verifyErrorMessage("게시글이 없습니다.");


        StepVerifier.create(bs.findByPk(0))
                .expectError(RuntimeException.class)
                .verify();
    }

    @Test
    @Order(4)
    @DisplayName("회원별 최근 5개 게시글 조회 테스트")
    @Disabled("레디스로 이동")
    void findByMemberPk() {
//        StepVerifier.create(bs.findByMemberPk(1))
//                    .expectNextCount(4)
//                    .verifyComplete();
//
//        StepVerifier.create(bs.findByMemberPk(1))
//                .assertNext(summaryList -> {
//                    assertEquals(4, summaryList.getId());
//                    assertEquals("테스트 제목4", summaryList.getTitle());
//                })
//                .assertNext(summaryList -> {
//                    assertEquals(3, summaryList.getId());
//                    assertEquals("테스트 제목3", summaryList.getTitle());
//                })
//                .assertNext(summaryList -> {
//                    assertEquals(2, summaryList.getId());
//                    assertEquals("테스트 제목2", summaryList.getTitle());
//                })
//                .assertNext(summaryList -> {
//                    assertEquals(1, summaryList.getId());
//                    assertEquals("테스트 제목1", summaryList.getTitle());
//                })
//                .verifyComplete();
//
//        StepVerifier.create(bs.findByMemberPk(3))
//                    .expectNextCount(2)
//                    .verifyComplete();
//
//        StepVerifier.create(bs.findByMemberPk(3))
//                .assertNext(summaryList -> {
//                    assertEquals(9, summaryList.getId());
//                    assertEquals("테스트 제목9", summaryList.getTitle());
//                })
//                .assertNext(summaryList -> {
//                    assertEquals(8, summaryList.getId());
//                    assertEquals("테스트 제목8", summaryList.getTitle());
//                })
//                .verifyComplete();
//
//        StepVerifier.create(bs.findByMemberPk(100))
//                .expectNextCount(0)
//                .verifyComplete();

    }

    @Test
    @Order(5)
    @DisplayName("게시글 추가 테스트")
    void save() {
        Board b = new Board();
        b.setMemberPk(1);
        b.setCategoryPk(1);
        b.setTitle("테스트 제목 추가");
        Map<String , Object> content = Map.of("content", "테스트 내용 추가");
        b.setContent(new JSONObject(content));

        StepVerifier.create(bs.save(b))
                .assertNext(board -> {
                    b.setId(board.getId());
                    assertEquals("테스트 제목 추가", board.getTitle());
                    assertEquals(1, board.getMemberPk());
                    assertEquals(1, board.getCategoryPk());
                    assertEquals(content, board.getContent());
                })
                .verifyComplete();

        StepVerifier.create(bs.findByPk(b.getId()))
                .assertNext(it -> {
                    assertEquals("테스트 제목 추가", it.getBoard().getTitle());
                    assertEquals(0, it.getBoard().getRate());
                    assertEquals(0, it.getBoard().getViewCount());
                    assertEquals("d-member-1", it.getMember().getName());
                })
                .verifyComplete();


        b.setMemberPk(100);
        StepVerifier.create(bs.save(b))
                .expectError(RuntimeException.class)
                .verify();

        b.setMemberPk(0);
        StepVerifier.create(bs.save(b))
                .expectError(RuntimeException.class)
                .verify();

        b.setMemberPk(1);
        b.setCategoryPk(11);
        StepVerifier.create(bs.save(b))
                .expectError(RuntimeException.class)
                .verify();

        b.setCategoryPk(0);
        StepVerifier.create(bs.save(b))
                .expectError(RuntimeException.class)
                .verify();

        b.setCategoryPk(1);
        b.setTitle(null);
        StepVerifier.create(bs.save(b))
                .expectError(RuntimeException.class)
                .verify();

        b.setTitle("테스트 제목 추가");
        b.setContent(null);
        StepVerifier.create(bs.save(b))
                    .expectError(RuntimeException.class)
                    .verify();
    }

    @RepeatedTest(5)
    @Order(6)
    @DisplayName("게시글 조회수 증가 테스트")
    void viewUpdateByPk() {
        StepVerifier.create(bs.viewUpdateByPk(1))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.viewUpdateByPk(1))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.viewUpdateByPk(2))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.viewUpdateByPk(100))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bs.viewUpdateByPk(0))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Order(7)
    @DisplayName("게시글 비활성화 테스트")
    void disableByPk() {
        StepVerifier.create(bs.disableByPk(1, 1))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.disableByPk(1, 1))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bs.disableByPk(10, 1))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bs.disableByPk(10, 4))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.disableByPk(0, 1))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bs.disableByPk(1, 100))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(bs.disableByPk(1, 0))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Order(8)
    @DisplayName("게시글 수정 테스트")
    void updateByPk() {
        BoardResultMap.Board content = bs.findByPk(1).block();
        Board b = new Board();
        b.setId(content.getId());
        b.setMemberPk(1);
        b.setCategoryPk(content.getBoard().getCategoryPk());
        b.setTitle("테스트 제목 수정");
        b.setContent(content.getBoard().getContent());
        b.setRate(content.getBoard().getRate());
        b.setViewCount(content.getBoard().getViewCount());
        b.setCreateAt(content.getBoard().getCreateAt());

        StepVerifier.create(bs.updateByPk(b))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.findByPk(1))
                .assertNext(it -> {
                    assertEquals(1, it.getId());
                    assertEquals("테스트 제목 수정", it.getBoard().getTitle());
                    assertEquals(0, it.getBoard().getRate());
                    assertEquals(0, it.getBoard().getViewCount());
                    assertEquals("d-member-1", it.getMember().getName());
                })
                .verifyComplete();

        Map<String, Object> newContent = Map.of("content", "테스트 내용 수정");
        b.setContent(new JSONObject(newContent));

        StepVerifier.create(bs.updateByPk(b))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.findByPk(1))
                .assertNext(it -> {
                    assertEquals(1, it.getId());
                    assertEquals("테스트 제목 수정", it.getBoard().getTitle());
                    assertEquals(0, it.getBoard().getRate());
                    assertEquals(0, it.getBoard().getViewCount());
                    assertEquals("d-member-1", it.getMember().getName());
                    assertEquals(newContent, it.getBoard().getContent());
                })
                .verifyComplete();

        b.setMemberPk(100);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(false)
                .verifyComplete();

        b.setMemberPk(1);
        b.setId(0);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(false)
                .verifyComplete();

        b.setId(content.getId());
        b.setCategoryPk(100);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(false)
                .verifyComplete();

        b.setCategoryPk(content.getBoard().getCategoryPk());
        b.setTitle(null);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(true)
                .verifyComplete();


        StepVerifier.create(bs.findByPk(1))
                .assertNext(it -> {
                    assertEquals(1, it.getId());
                    assertEquals("테스트 제목 수정", it.getBoard().getTitle());
                    assertEquals(0, it.getBoard().getRate());
                    assertEquals(0, it.getBoard().getViewCount());
                    assertEquals("d-member-1", it.getMember().getName());
                    assertEquals(newContent, it.getBoard().getContent());
                })
                .verifyComplete();


        b.setTitle("테스트 제목 수정");
        b.setContent(null);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.findByPk(1))
                .assertNext(it -> {
                    assertEquals(1, it.getId());
                    assertEquals("테스트 제목 수정", it.getBoard().getTitle());
                    assertEquals(0, it.getBoard().getRate());
                    assertEquals(0, it.getBoard().getViewCount());
                    assertEquals("d-member-1", it.getMember().getName());
                    assertEquals(newContent, it.getBoard().getContent());
                })
                .verifyComplete();

        b.setRate(100);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.findByPk(1))
                .assertNext(it -> {
                    assertEquals(1, it.getId());
                    assertEquals("테스트 제목 수정", it.getBoard().getTitle());
                    assertNotEquals(100, it.getBoard().getRate());
                    assertEquals(0, it.getBoard().getViewCount());
                    assertEquals("d-member-1", it.getMember().getName());
                    assertEquals(newContent, it.getBoard().getContent());
                })
                .verifyComplete();

        b.setViewCount(100);
        StepVerifier.create(bs.updateByPk(b))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(bs.findByPk(1))
                    .assertNext(it -> {
                        assertEquals(1, it.getId());
                        assertEquals("테스트 제목 수정", it.getBoard().getTitle());
                        assertEquals(0, it.getBoard().getRate());
                        assertNotEquals(100, it.getBoard().getViewCount());
                        assertEquals("d-member-1", it.getMember().getName()) ;
                        assertEquals(newContent, it.getBoard().getContent());
                    })
                    .verifyComplete();
    }

    @Test
    void addSelectAnswerQueue() {
        SelectAnswerQueueDto saqdto = new SelectAnswerQueueDto();
        saqdto.setBoardPk(1);
        saqdto.setBoardTitle("테스트 제목");
        saqdto.setPoint(500);
        saqdto.setSmtpHost("smtp.gmail.com");
        saqdto.setSmtpPort("587");
        saqdto.setSmtpUser("d-member-1");
        saqdto.setSmtpPassword("password");

        StepVerifier.create(bs.addSelectAnswerQueue(saqdto))
                .expectNext(false)
                .verifyComplete();
    }
}