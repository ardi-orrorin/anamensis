package com.anamensis.server.service;

import com.anamensis.server.entity.PointCode;
import org.junit.jupiter.api.*;
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
class PointServiceTest {

    @SpyBean
    PointService ps;

    @Test
    @Order(1)
    @DisplayName("모든 포인트 코드 찾기")
    void selectAll() {
        StepVerifier.create(ps.selectAll())
                .assertNext(pc -> {
                    assertEquals(10, pc.size());
                    pc.stream().reduce((acc, next) -> {
                        assertTrue(acc.getId() < next.getId());
                        return next;
                    });
                })
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("포인트 코드 시퀀스넘버로 찾기")
    void selectByIdOrName() {
        StepVerifier.create(ps.selectByIdOrName("1"))
                .assertNext(pc -> {
                    assertEquals(1, pc.getId());
                    assertEquals("attend-1", pc.getName());
                })
                .verifyComplete();

        StepVerifier.create(ps.selectByIdOrName("10"))
                .assertNext(pc -> {
                    assertEquals(10, pc.getId());
                    assertEquals("attend-10", pc.getName());
                })
                .verifyComplete();


        StepVerifier.create(ps.selectByIdOrName("11"))
                .expectError(RuntimeException.class)
                .verify();

        StepVerifier.create(ps.selectByIdOrName("11"))
                .verifyErrorMessage("not found");

        StepVerifier.create(ps.selectByIdOrName("99"))
                .expectError(RuntimeException.class)
                .verify();

        StepVerifier.create(ps.selectByIdOrName("99"))
                .verifyErrorMessage("not found");
    }

    @Test
    @Order(3)
    @DisplayName("포인트 코드 추가")
    void insert() {
        PointCode pc = new PointCode();
        pc.setName("attend-10");
        pc.setPoint(11);

        StepVerifier.create(ps.insert(pc))
                .assertNext(Assertions::assertFalse)
                .verifyComplete();

        pc.setName("attend-11");

        StepVerifier.create(ps.insert(pc))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        StepVerifier.create(ps.selectByIdOrName("11"))
                .assertNext(p -> {
                    assertEquals("attend-11", p.getName());
                })
                .verifyComplete();
    }


}