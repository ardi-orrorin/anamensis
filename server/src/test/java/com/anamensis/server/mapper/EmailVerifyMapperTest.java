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
        emailVerify = new EmailVerify();
        emailVerify.setEmail("test@test.com");
        emailVerify.setCode(emailVerifyProvider.generateCode());
        emailVerify.setExpireAt(LocalDateTime.now().plusMinutes(10));
    }

    @Test
    void selectByEmailAndCode() {

        EmailVerify join = new EmailVerify();
        join.setEmail("test@test.com");
        join.setCode("463130");
        join.setExpireAt(LocalDateTime.now());

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
        EmailVerify join = new EmailVerify();
        join.setEmail("yoosc89@gmail.com");
        join.setCode("775009");
        join.setExpireAt(LocalDateTime.now());

        EmailVerify e1 = emailVerifyMapper.selectByEmailAndCode(join)
                .orElseThrow(() -> new RuntimeException("not found"));;

        e1.setUse(false);

        emailVerifyMapper.updateIsUse(e1);
    }

    @Test
    void insertTest() {
        EmailVerify email1 = new EmailVerify();
        email1.setEmail("test@test.com");

        log.info("code: {}", emailVerifyService.insert(email1));
    }

    @Test
    void updateIsUseTest() {
        EmailVerify email1 = new EmailVerify();
        email1.setEmail("test@test.com");
        email1.setCode("787522");

        log.info("result: {}", emailVerifyService.updateIsUse(email1));

    }
}