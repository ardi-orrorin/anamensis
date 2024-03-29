package com.anamensis.server.mapper;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.provider.EmailVerifyProvider;
import com.anamensis.server.service.EmailVerifyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EmailVerifyMapperTest {

    @SpyBean
    EmailVerifyService emailVerifyService;


    @SpyBean
    EmailVerifyMapper emailVerifyMapper;

    @SpyBean
    EmailVerifyProvider emailVerifyProvider;

    EmailVerify emailVerify;

    Logger log = org.slf4j.LoggerFactory.getLogger(EmailVerifyMapperTest.class);

    @BeforeEach
    void setUp() {
        emailVerify = EmailVerify.builder()
                .email("test@test.com")
                .code(emailVerifyProvider.generateCode())
                .expireAt(LocalDateTime.now().plusMinutes(10))
                .build();
    }

    @Test
    void selectByEmailAndCode() {

        EmailVerify join = EmailVerify.builder()
                .email("test@test.com")
                .code("463130")
                .expireAt(LocalDateTime.now())
                .build();

        EmailVerify result = emailVerifyMapper.selectByEmailAndCode(join)
                .orElseThrow(() -> new RuntimeException("not found"));
        log.info("result: {}", result);
    }

    @Test
    void insert() {
        emailVerifyMapper.insert(emailVerify);
    }

    @Test
    void updateIsUse() {
        EmailVerify join = EmailVerify.builder()
                .email("test@test.com")
                .code("409604")
                .expireAt(LocalDateTime.now())
                .build();

        EmailVerify e1 = emailVerifyMapper.selectByEmailAndCode(join)
                .orElseThrow(() -> new RuntimeException("not found"));;

        e1.setUse(false);

        emailVerifyMapper.updateIsUse(e1);
    }

    @Test
    void insertTest() {
        EmailVerify email1 = EmailVerify.builder()
                .email("test@test.com")
                .build();

        log.info("code: {}", emailVerifyService.insert(email1));
    }

    @Test
    void updateIsUseTest() {
        EmailVerify email1 = EmailVerify.builder()
                .email("test@test.com")
                .code("787522")
                .build();

        log.info("result: {}", emailVerifyService.updateIsUse(email1));

    }
}