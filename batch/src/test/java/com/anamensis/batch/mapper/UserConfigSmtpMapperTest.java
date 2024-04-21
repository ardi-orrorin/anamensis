package com.anamensis.batch.mapper;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserConfigSmtpMapperTest {

    @SpyBean
    UserConfigSmtpMapper userConfigSmtpMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserConfigSmtpMapperTest.class);

    @Test
    void findAll() {

        log.info("userConfigSmtpMapper.findAll() : {}", userConfigSmtpMapper.findAll());

    }
}