package com.anamensis.server.service;

import com.anamensis.server.entity.EmailVerify;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
@Disabled("s3 연동으로 비용 발생 가능성 있음")
class EmailVerifyServiceTest {

    @SpyBean
    EmailVerifyService svs;

    @Value("${test.email-verify.email}")
    String EMAIL_ADDRESS;

    @Test
    @Order(1)
    @DisplayName("이메일 인증코드 저장 테스트")
    void insert() {
        EmailVerify ev = new EmailVerify();
        ev.setEmail(EMAIL_ADDRESS);

        StepVerifier.create(svs.insert(ev))
                .expectNextMatches(code -> code.length() == 6)
                .verifyComplete();

        ev.setEmail(null); //없는 계정
        StepVerifier.create(svs.insert(ev))
                .expectError(RuntimeException.class)
                .verify();

        StepVerifier.create(svs.insert(null))
                .expectError(RuntimeException.class)
                .verify();

    }

    @Test
    @Order(2)
    @DisplayName("이메일 인증코드 사용 테스트")
    void updateIsUse() {

        AtomicReference<EmailVerify> ev = new AtomicReference<>();
        ev.set(new EmailVerify());
        ev.get().setEmail(EMAIL_ADDRESS);

        StepVerifier.create(svs.insert(ev.get()))
                .assertNext(code -> {
                    ev.get().setCode(code);
                })
                .verifyComplete();

        StepVerifier.create(svs.updateIsUse(ev.get()))
                .expectNext(true)
                .verifyComplete();


        StepVerifier.create(svs.insert(ev.get()))
                .assertNext(code -> {
                    ev.get().setCode("123455");
                })
                .verifyComplete();

        StepVerifier.create(svs.updateIsUse(ev.get()))
                .expectNext(false)
                .verifyComplete();

        ev.get().setEmail(null);
        StepVerifier.create(svs.updateIsUse(ev.get()))
                .expectError(RuntimeException.class)
                .verify();
    }
}