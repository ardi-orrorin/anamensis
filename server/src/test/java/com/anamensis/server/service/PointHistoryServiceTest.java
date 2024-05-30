package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.PointHistoryRequest;
import com.anamensis.server.entity.PointHistory;
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
class PointHistoryServiceTest {

    @SpyBean
    PointHistoryService phs;

    @Test
    @Order(1)
    @DisplayName("포인트 히스토리 추가")
    void insert() {
        PointHistory ph = new PointHistory();

        ph.setMemberPk(1L);
        StepVerifier.create(phs.insert(ph))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();

        ph.setPointCodePk(1L);
        StepVerifier.create(phs.insert(ph))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();

        ph.setTableCodePk(1L);
        StepVerifier.create(phs.insert(ph))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();

        ph.setTableRefPk(0);
        StepVerifier.create(phs.insert(ph))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();

        ph.setCreateAt(LocalDateTime.now());

        StepVerifier.create(phs.insert(ph))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

    }

    @Test
    @Order(2)
    @DisplayName("포인트 히스토리 조회")
    void selectByPointHistory() {
        Page page = new Page();
        page.setPage(1);
        page.setSize(4);

        PointHistoryRequest.Param param = new PointHistoryRequest.Param();

        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(4, ph.size());
                    ph.stream().reduce((acc, next) -> {
                        assertTrue(acc.getId() > next.getId());
                        return next;
                    });
                })
                .verifyComplete();

        page.setPage(2);
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(2, ph.size());
                    ph.stream().reduce((acc, next) -> {
                        assertTrue(acc.getId() > next.getId());
                        return next;
                    });
                })
                .verifyComplete();

        page.setPage(1);
        param.setMemberPk(1L);
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(3, ph.size());
                })
                .verifyComplete();

        param.setMemberPk(2L);
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(2, ph.size());
                })
                .verifyComplete();

        param.setMemberPk(3L);
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(1, ph.size());
                })
                .verifyComplete();
        param.setMemberPk(0);
        param.setTableName("board");
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(3, ph.size());
                })
                .verifyComplete();

        param.setTableName(null);
        param.setTableRefPk(1L);
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(2, ph.size());
                })
                .verifyComplete();

        param.setTableName("board");
        param.setTableRefPk(1L);
        StepVerifier.create(phs.selectByPointHistory(param, page))
                .assertNext(ph -> {
                    assertEquals(1, ph.size());
                })
                .verifyComplete();
    }

}