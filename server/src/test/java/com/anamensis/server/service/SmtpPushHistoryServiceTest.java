package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SmtpPushHistoryServiceTest {

    @SpyBean
    SmtpPushHistoryService sphs;

    Logger log = org.slf4j.LoggerFactory.getLogger(SmtpPushHistoryServiceTest.class);


    @Test
    @Order(1)
    @DisplayName("")
    @Disabled
    void countByMemberPk() {
    }

    @Test
    @Order(2)
    @DisplayName("회원별 히스토리 찾기")
    void findByMemberPk() {
        Page page = new Page();
        page.setPage(1);
        page.setSize(6);
        StepVerifier.create(sphs.findByMemberPk(1L, page))
                .assertNext(sm -> {
                    assertEquals(10, sm.getId());
                    assertEquals("테스트 제목10", sm.getSubject());
                    assertEquals("메세지10", sm.getMessage());
                })
                .expectNextCount(3)
                .assertNext(sm -> {
                    assertEquals(6, sm.getId());
                    assertEquals("테스트 제목6", sm.getSubject());
                    assertEquals("메세지6", sm.getMessage());
                })
                .assertNext(sm -> {
                    assertEquals(5, sm.getId());
                    assertEquals("테스트 제목5", sm.getSubject());
                    assertEquals("메세지5", sm.getMessage());
                })
                .verifyComplete();

        page.setPage(2);
        StepVerifier.create(sphs.findByMemberPk(1L, page))
                .assertNext(sm -> {
                    assertEquals(4, sm.getId());
                    assertEquals("테스트 제목4", sm.getSubject());
                    assertEquals("메세지4", sm.getMessage());
                })
                .expectNextCount(2)
                .assertNext(sm -> {
                    assertEquals(1, sm.getId());
                    assertEquals("테스트 제목1", sm.getSubject());
                    assertEquals("메세지1", sm.getMessage());
                })
                .verifyComplete();

        page.setPage(2);
        page.setSize(2);

        StepVerifier.create(sphs.findByMemberPk(1L, page))
                .assertNext(sm -> {
                    assertEquals(8, sm.getId());
                    assertEquals("테스트 제목8", sm.getSubject());
                    assertEquals("메세지8", sm.getMessage());
                })
                .assertNext(sm -> {
                    assertEquals(7, sm.getId());
                    assertEquals("테스트 제목7", sm.getSubject());
                    assertEquals("메세지7", sm.getMessage());
                })
                .verifyComplete();

    }

    @Test
    @Order(3)
    @DisplayName("아이디로 찾기")
    void findById() {
        StepVerifier.create(sphs.findById(1L))
                .assertNext(sm -> {
                    assertEquals(1, sm.getId());
                    assertEquals("테스트 제목1", sm.getSubject());
                    assertEquals("테스트 내용1", sm.getContent());
                    assertEquals("메세지1", sm.getMessage());
                })
                .verifyComplete();

        StepVerifier.create(sphs.findById(10L))
                .assertNext(sm -> {
                    assertEquals(10, sm.getId());
                    assertEquals("테스트 제목10", sm.getSubject());
                    assertEquals("테스트 내용10", sm.getContent());
                    assertEquals("메세지10", sm.getMessage());
                    assertEquals("FAIL", sm.getStatus());
                })
                .verifyComplete();

        StepVerifier.create(sphs.findById(100L))
                .expectError(RuntimeException.class)
                .verify();

        StepVerifier.create(sphs.findById(100L))
                .verifyErrorMessage("Not found id: 100");
    }

}