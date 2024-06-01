package com.anamensis.server.service;

import com.anamensis.server.entity.Attendance;
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
class AttendanceServiceTest {

    @SpyBean
    AttendanceService as;

    @Test
    @Order(1)
    @DisplayName("출석 정보 조회 테스트")
    void findByMemberPk() {
        StepVerifier.create(as.findByMemberPk(1))
                .assertNext(attend -> {
                    assertEquals(1, attend.getMemberPk());
                    assertEquals(1, attend.getDays());
                })
                .verifyComplete();

        StepVerifier.create(as.findByMemberPk(2))
                .assertNext(attend -> {
                    assertEquals(2, attend.getMemberPk());
                    assertEquals(1, attend.getDays());
                })
                .verifyComplete();

        StepVerifier.create(as.findByMemberPk(3))
                .assertNext(attend -> {
                    assertEquals(3, attend.getMemberPk());
                    assertEquals(1, attend.getDays());
                })
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("출석 정보 초기화 테스트")
    void init() {
        StepVerifier.create(as.init(1))
                .verifyError(RuntimeException.class);

        StepVerifier.create(as.init(2))
                .verifyError(RuntimeException.class);

        StepVerifier.create(as.init(5))
                .verifyError(RuntimeException.class);

        StepVerifier.create(as.init(10))
                .verifyError(RuntimeException.class);

        StepVerifier.create(as.init(3))
                .verifyComplete();

        StepVerifier.create(as.init(4))
                .verifyComplete();

    }

    @Test
    @Order(3)
    @DisplayName("출석 체크 테스트")
    @Disabled
    void update() {
        // mysql만 가능
        StepVerifier.create(as.update(1))
                .verifyErrorMessage("오늘은 이미 출석 했습니다.");

        StepVerifier.create(as.init(3))
                .verifyComplete();

        StepVerifier.create(as.update(3))
                .verifyErrorMessage("오늘은 이미 출석 했습니다.");

        StepVerifier.create(as.update(2))
                .assertNext(attend -> {
                    assertEquals(2, attend.getMemberPk());
                    assertEquals(2, attend.getDays());
                })
                .verifyComplete();

        StepVerifier.create(as.update(100))
                .verifyError(RuntimeException.class);

    }
}