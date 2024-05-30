package com.anamensis.server.service;

import com.anamensis.server.entity.MemberConfigSmtp;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
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
class MemberConfigSmtpServiceTest {

    @SpyBean
    MemberConfigSmtpService mcss;

    @Value("${test.smtp.host}")
    String SMTP_HOST;

    @Value("${test.smtp.port}")
    String SMTP_PORT;

    @Value("${test.smtp.username}")
    String SMTP_USERNAME;

    @Value("${test.smtp.password}")
    String SMTP_PASSWORD;

    Logger log = org.slf4j.LoggerFactory.getLogger(MemberConfigSmtpServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("유저 PK로 유저 SMTP 설정 조회")
    void selectByUserPk() {
        StepVerifier.create(mcss.selectByUserPk(1L))
                .expectNextCount(2)
                .assertNext(userConfigSmtp -> {
                    assertEquals(1L, userConfigSmtp.getMemberPk());
                    assertEquals("smtp.gmail.com", userConfigSmtp.getHost());
                    assertTrue(userConfigSmtp.getPort().equals("587"));
                    assertTrue(userConfigSmtp.getFromEmail().equals("username1@gmail.com"));
                })
                .verifyComplete();

        StepVerifier.create(mcss.selectByUserPk(2L))
                .assertNext(userConfigSmtp -> {
                    assertTrue(userConfigSmtp.getFromEmail().equals("username2@gmail.com"));
                })
                .assertNext(userConfigSmtp -> {
                    assertTrue(userConfigSmtp.getFromEmail().equals("username3@gmail.com"));
                })
                .verifyComplete();

        StepVerifier.create(mcss.selectByUserPk(10L))
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("ID로 유저 SMTP 설정 조회")
    void selectById() {
        StepVerifier.create(mcss.selectById(1L))
                .assertNext(userConfigSmtp -> {
                    assertEquals(1L, userConfigSmtp.getMemberPk());
                    assertEquals("smtp.gmail.com", userConfigSmtp.getHost());
                    assertEquals("587", userConfigSmtp.getPort());
                    assertEquals("test1@gmail.com", userConfigSmtp.getFromEmail());
                    assertEquals("username1", userConfigSmtp.getUsername());
                })
                .verifyComplete();

        StepVerifier.create(mcss.selectById(2L))
                .assertNext(userConfigSmtp -> {
                    assertEquals(1L, userConfigSmtp.getMemberPk());
                    assertEquals("smtp.gmail.com", userConfigSmtp.getHost());
                    assertEquals("587", userConfigSmtp.getPort());
                    assertEquals("test2@gmail.com", userConfigSmtp.getFromEmail());
                    assertEquals("username2", userConfigSmtp.getUsername());
                })
                .verifyComplete();

        StepVerifier.create(mcss.selectById(6L))
                .verifyErrorMessage("UserConfigSmtp not found");

        StepVerifier.create(mcss.selectById(99L))
                .verifyErrorMessage("UserConfigSmtp not found");
    }

    @Test
    @Order(3)
    @DisplayName("유저 SMTP 설정 저장")
    void save() {
        MemberConfigSmtp ucs = new MemberConfigSmtp();
        ucs.setMemberPk(1L);
        ucs.setHost("smtp.gmail.com");
        ucs.setPort("587");
        ucs.setUsername("testname1");
        ucs.setPassword("testpassword1");
        ucs.setIsUse(true);
        ucs.setUseSSL(true);
        ucs.setIsDefault(true);

        StepVerifier.create(mcss.save(ucs))
                .verifyErrorMessage("UserConfigSmtp not save");


        ucs.setFromEmail("testname1@gmail.com");
        ucs.setFromName("testname1");
        StepVerifier.create(mcss.save(ucs))
                .assertNext(userConfigSmtp -> {
                    assertTrue(userConfigSmtp.getIsDefault());
                })
                .verifyComplete();

        StepVerifier.create(mcss.selectByUserPk(1L))
                .assertNext(userConfigSmtp -> {
                    assertFalse(userConfigSmtp.getIsDefault());
                })
                .expectNextCount(2)
                .assertNext(userConfigSmtp -> {
                    assertTrue(userConfigSmtp.getIsDefault());
                })
                .verifyComplete();
    }

    @Test
    @Order(4)
    @DisplayName("유저 SMTP 설정 수정")
    void update() {

        MemberConfigSmtp ucs = mcss.selectById(1L).block();
        ucs.setUsername("username2");

        StepVerifier.create(mcss.update(ucs))
                .assertNext(aBoolean -> {
                    assertTrue(aBoolean);
                })
                .verifyComplete();

        StepVerifier.create(mcss.selectById(1L))
                .assertNext(userConfigSmtp -> {
                    assertEquals("username2", userConfigSmtp.getUsername());
                })
                .verifyComplete();

        ucs.setMemberPk(99L);
        StepVerifier.create(mcss.update(ucs))
                .verifyErrorMessage("UserConfigSmtp not update");
    }

    @Test
    @Order(5)
    @DisplayName("유저 SMTP 연결 테스트")
    void testConnection() {
        MemberConfigSmtp ucs = mcss.selectById(1L).block();
        StepVerifier.create(mcss.testConnection(ucs))
                .assertNext(aBoolean -> {
                    assertFalse(aBoolean);
                })
                .verifyComplete();

        ucs.setHost(SMTP_HOST);
        ucs.setUsername(SMTP_USERNAME);
        ucs.setPassword(SMTP_PASSWORD);
        ucs.setPort(SMTP_PORT);
        ucs.setUseSSL(true);

        StepVerifier.create(mcss.testConnection(ucs))
                .assertNext(aBoolean -> {
                    assertTrue(aBoolean);
                })
                .verifyComplete();
    }

    @Test
    @Order(6)
    @DisplayName("유저 SMTP 설정 비활성화")
    void disabled() {
        StepVerifier.create(mcss.disabled(1L, 1L))
                .assertNext(Assertions::assertTrue)
                .verifyComplete();

        StepVerifier.create(mcss.selectByUserPk(1L))
                .assertNext(userConfigSmtp -> {
                    assertTrue(userConfigSmtp.getIsUse());
                    assertTrue(userConfigSmtp.getIsDefault());
                })
                .expectNextCount(1)
                .verifyComplete();
    }
}