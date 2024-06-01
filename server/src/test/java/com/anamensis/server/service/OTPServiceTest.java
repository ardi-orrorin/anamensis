package com.anamensis.server.service;

import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.OTP;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.ImportRuntimeHints;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.nio.file.FileVisitOption;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class OTPServiceTest {

    @SpyBean
    OTPService os;

    @SpyBean
    UserService us;

    Logger log = org.slf4j.LoggerFactory.getLogger(OTPServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("사용자 아이디로 OTP 조회")
    void selectByUserId() {
        StepVerifier.create(os.selectByUserId("d-member-1"))
                    .expectNextCount(1)
                    .verifyComplete();

        StepVerifier.create(os.selectByUserId("d-member-2"))
                    .expectNextCount(1)
                    .verifyComplete();

        StepVerifier.create(os.selectByUserId("d-member-3"))
                    .expectNextCount(1)
                    .verifyComplete();

        StepVerifier.create(os.selectByUserId("d-member-4"))
                    .verifyErrorMessage("not found");

        StepVerifier.create(os.selectByUserId("d-member-5"))
                    .verifyError(RuntimeException.class);


        StepVerifier.create(os.selectByUserId(null))
                .verifyErrorMessage("not found");

        StepVerifier.create(os.selectByUserId("\nd-member-1"))
                .verifyErrorMessage("not found");

    }

    @Test
    @Order(2)
    @DisplayName("사용자 PK로 OTP 조회")
    void selectByMemberPk() {
        StepVerifier.create(os.selectByMemberPk(1))
                    .expectNextCount(1)
                    .verifyComplete();

        StepVerifier.create(os.selectByMemberPk(2))
                    .expectNextCount(1)
                    .verifyComplete();

        StepVerifier.create(os.selectByMemberPk(3))
                    .expectNextCount(1)
                    .verifyComplete();

        StepVerifier.create(os.selectByMemberPk(4))
                    .verifyErrorMessage("not found");

        StepVerifier.create(os.selectByMemberPk(5))
                    .verifyError(RuntimeException.class);

        StepVerifier.create(os.selectByMemberPk(0))
                .verifyErrorMessage("not found");

        StepVerifier.create(os.selectByMemberPk(-1))
                .verifyErrorMessage("not found");

        StepVerifier.create(os.selectByMemberPk(Long.MAX_VALUE))
                .verifyErrorMessage("not found");
    }

    @Test
    @Order(3)
    @DisplayName("OTP 등록")
    void insert() {
        Member member1 = us.findUserByUserId("d-member-1").block();

        StepVerifier.create(os.insert(member1))
                    .assertNext(url -> {
                        assertNotNull(url);
                        assertTrue(url.length() > 0);
                    })
                    .verifyComplete();

        StepVerifier.create(os.selectByUserId(member1.getUserId()))
                    .assertNext(otp -> {
                        assertNotNull(otp);
                        assertEquals(member1.getId(), otp.getMemberPk());
                    })
                    .verifyComplete();


        Member member2 = us.findUserByUserId("d-member-2").block();


        StepVerifier.create(os.insert(member2))
                    .assertNext(url -> {
                        assertNotNull(url);
                        assertTrue(url.length() > 0);
                    })
                    .verifyComplete();

        StepVerifier.create(os.selectByUserId(member2.getUserId()))
                    .assertNext(otp -> {
                        assertNotNull(otp);
                        assertEquals(member2.getId(), otp.getMemberPk());
                    })
                    .verifyComplete();


        member1.setId(99);

        StepVerifier.create(os.insert(member1))
                    .verifyError(RuntimeException.class);

        member2.setId(100);

        StepVerifier.create(os.insert(member2))
                .verifyError(RuntimeException.class);

        StepVerifier.create(os.insert(null))
                .verifyError(RuntimeException.class);

        member2.setId(0);

        StepVerifier.create(os.insert(member2))
                .verifyError(RuntimeException.class);
    }

    @Test
    @Order(4)
    @DisplayName("OTP 사용")
    void update() {
        OTP otp1 = os.selectByMemberPk(1).block();
        StepVerifier.create(os.update(otp1))
                    .expectNext(true)
                    .verifyComplete();


        StepVerifier.create(os.update(otp1))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(os.update(null))
                    .verifyError(RuntimeException.class);

        otp1.setHash(null);

        StepVerifier.create(os.update(otp1))
                .verifyError(RuntimeException.class);

        otp1.setHash("sdfsdf");

        StepVerifier.create(os.update(otp1))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Order(5)
    @DisplayName("OTP 비활성화")
    void disableOTP() {

        StepVerifier.create(os.disableOTP(3))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(os.disableOTP(3))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(os.disableOTP(1))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(os.disableOTP(0))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(os.disableOTP(-1))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(os.disableOTP(Long.MAX_VALUE))
                .expectNext(false)
                .verifyComplete();

    }

    @Test
    @Order(6)
    @DisplayName("사용자 PK로 OTP 존재 여부 확인")
    void existByMemberPk() {
        StepVerifier.create(os.existByMemberPk(1))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(os.existByMemberPk(2))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(os.existByMemberPk(3))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(os.existByMemberPk(4))
                    .expectNext(false)
                    .verifyComplete();

        StepVerifier.create(os.existByMemberPk(5))
                    .expectNext(false)
                    .verifyComplete();

        StepVerifier.create(os.existByMemberPk(0))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(os.existByMemberPk(-1))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(os.existByMemberPk(Long.MAX_VALUE))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Disabled("분 단위 code 변경으로 테스트 불가")
    void verify() {
    }
}