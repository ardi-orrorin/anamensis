package com.anamensis.server.service;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.mapper.EmailVerifyMapper;
import com.anamensis.server.provider.EmailVerifyProvider;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

@SpringBootTest
class EmailVerifyServiceTest {

    @SpyBean
    EmailVerifyService emailVerifyService;

    @SpyBean
    EmailVerifyMapper emailVerifyMapper;

    @SpyBean
    EmailVerifyProvider emailVerifyProvider;

    Logger log = org.slf4j.LoggerFactory.getLogger(EmailVerifyServiceTest.class);

    @Test
    void insert() {
        EmailVerify emailVerify = EmailVerify.builder()
                .email("test@test.com")
                .code(emailVerifyProvider.generateCode())
                .createAt(LocalDateTime.now())
                .expireAt(LocalDateTime.now().plusMinutes(10))
                .build();

        emailVerifyMapper.insert(emailVerify);
    }

    @Test
    void selectByEmailAndCode() {
        EmailVerify emailVerify = EmailVerify.builder()
                .email("test@test.com")
                .code("982964")
                .expireAt(LocalDateTime.now())
                .build();


        EmailVerify r =  emailVerifyMapper.selectByEmailAndCode(emailVerify)
                .orElseThrow(() -> new RuntimeException("not found"));

        log.info("result: {}", r);

    }

}