package com.anamensis.server.service;

import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.Member;
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
class LoginHistoryServiceTest {

    @SpyBean
    LoginHistoryService lhs;

    @SpyBean
    UserService ms;

    @Test
    @Order(1)
    @DisplayName("로그인 기록 갯수 조회")
    void count() {
        StepVerifier.create(lhs.count(1))
                .expectNext(4)
                .verifyComplete();

        StepVerifier.create(lhs.count(2))
                .expectNext(3)
                .verifyComplete();

        StepVerifier.create(lhs.count(3))
                .expectNext(2)
                .verifyComplete();

        StepVerifier.create(lhs.count(4))
                .expectNext(1)
                .verifyComplete();

        StepVerifier.create(lhs.count(5))
                .expectNext(1)
                .verifyComplete();

        StepVerifier.create(lhs.count(6))
                .expectNext(0)
                .verifyComplete();

        StepVerifier.create(lhs.count(0))
                .expectNext(0)
                .verifyComplete();

        StepVerifier.create(lhs.count(-1))
                .expectNext(0)
                .verifyComplete();

        StepVerifier.create(lhs.count(Long.MAX_VALUE))

                .expectNext(0)
                .verifyComplete();

        StepVerifier.create(lhs.count(Long.MAX_VALUE+1))
                .expectNext(0)
                .verifyComplete();

    }

    @Test
    @Order(2)
    @DisplayName("로그인 기록 조회")
    void selectAll() {
        Page page = new Page();
        page.setPage(1);
        page.setSize(6);

        Member m1 = ms.findUserByUserId("d-member-1").block();

        StepVerifier.create(lhs.selectAll(m1, page))
                .expectNextCount(4)
                .verifyComplete();

        StepVerifier.create(lhs.selectAll(m1, page))
                .assertNext(loginHistory -> {
                    assertEquals(4, loginHistory.getId());
                })
                .assertNext(loginHistory -> {
                    assertEquals(3, loginHistory.getId());
                })
                .assertNext(loginHistory -> {
                    assertEquals(2, loginHistory.getId());
                })
                .assertNext(loginHistory -> {
                    assertEquals(1, loginHistory.getId());
                })
                .verifyComplete();

        Member m2 = ms.findUserByUserId("d-member-3").block();

        StepVerifier.create(lhs.selectAll(m2, page))
                .expectNextCount(2)
                .verifyComplete();

        StepVerifier.create(lhs.selectAll(m2, page))
                .assertNext(loginHistory -> {
                    assertEquals(9, loginHistory.getId());
                })
                .assertNext(loginHistory -> {
                    assertEquals(8, loginHistory.getId());
                })
                .verifyComplete();
    }

    @Test
    @Order(3)
    @DisplayName("로그인 기록 저장")
    void save() {
        Member m1 = ms.findUserByUserId("d-member-1").block();
        Device device = new Device();
        device.setIp("128.0.0.1");
        device.setDevice("device");
        device.setLocation("location");

        StepVerifier.create(lhs.save(device, m1))
                    .verifyComplete();

        StepVerifier.create(lhs.count(1))
                    .expectNext(5)
                    .verifyComplete();

        m1.setId(9999);
        StepVerifier.create(lhs.save(device, m1))
                    .verifyError(RuntimeException.class);

        m1.setId(0);
        StepVerifier.create(lhs.save(device, m1))
                    .verifyError(RuntimeException.class);

        m1.setId(-1);
        StepVerifier.create(lhs.save(device, m1))
                    .verifyError(RuntimeException.class);

        StepVerifier.create(lhs.save(device, m1))
                .verifyErrorMessage("LoginHistory save failed");

        Member m2 = ms.findUserByUserId("d-member-2").block();
        StepVerifier.create(lhs.save(device, m2))
                    .verifyComplete();

        StepVerifier.create(lhs.count(2))
                    .expectNext(4)
                    .verifyComplete();

    }
}