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

        StepVerifier.create(phs.selectByPointHistory(param, page, 0))
                .assertNext(ph -> {
                    assertEquals(4, ph.size());
                    ph.stream().reduce((acc, next) -> {
                        assertTrue(acc.getId() > next.getId());
                        return next;
                    });
                })
                .verifyComplete();

        page.setPage(2);
        StepVerifier.create(phs.selectByPointHistory(param, page,0))
                .assertNext(ph -> {
                    assertEquals(2, ph.size());
                    ph.stream().reduce((acc, next) -> {
                        assertTrue(acc.getId() > next.getId());
                        return next;
                    });
                })
                .verifyComplete();

        page.setPage(1);
        StepVerifier.create(phs.selectByPointHistory(param, page, 1))
                .assertNext(ph -> {
                    assertEquals(3, ph.size());
                })
                .verifyComplete();

        StepVerifier.create(phs.selectByPointHistory(param, page, 2))
                .assertNext(ph -> {
                    assertEquals(2, ph.size());
                })
                .verifyComplete();

        StepVerifier.create(phs.selectByPointHistory(param, page,3))
                .assertNext(ph -> {
                    assertEquals(1, ph.size());
                })
                .verifyComplete();

        param.setTableName("board");
        StepVerifier.create(phs.selectByPointHistory(param, page, 0))
                .assertNext(ph -> {
                    assertEquals(3, ph.size());
                })
                .verifyComplete();

        param.setTableName(null);
        StepVerifier.create(phs.selectByPointHistory(param, page, 0))
                .assertNext(ph -> {
                    assertEquals(4, ph.size());
                })
                .verifyComplete();
    }

    @Test
    @Order(3)
    @DisplayName("포인트 히스토리 카운트")
    void count() {
        PointHistoryRequest.Param param = new PointHistoryRequest.Param();

        StepVerifier.create(phs.count(param, 0))
                .assertNext(count -> {
                    assertEquals(6, count);
                })
                .verifyComplete();

        param.setPointCodeName("attend-1");
        StepVerifier.create(phs.count(param, 0))
                .assertNext(count -> {
                    assertEquals(1, count);
                })
                .verifyComplete();

        param.setPointCodeName(null);
        param.setTableName("board");
        StepVerifier.create(phs.count(param, 0))
                .assertNext(count -> {
                    assertEquals(3, count);
                })
                .verifyComplete();

        param.setTableName(null);
        StepVerifier.create(phs.count(param, 1))
                .assertNext(count -> {
                    assertEquals(3, count);
                })
                .verifyComplete();

        StepVerifier.create(phs.count(param, 2))
                .assertNext(count -> {
                    assertEquals(2, count);
                })
                .verifyComplete();

        StepVerifier.create(phs.count(param, 3))
                .assertNext(count -> {
                    assertEquals(1, count);
                })
                .verifyComplete();

        StepVerifier.create(phs.count(param, 99))
                .assertNext(count -> {
                    assertEquals(0, count);
                })
                .verifyComplete();
    }
}