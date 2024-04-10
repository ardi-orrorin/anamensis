package com.anamensis.server.mapper;

import com.anamensis.server.entity.UserConfigSmtp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserConfigSmtpMapperTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(UserConfigSmtpMapperTest.class);

    @SpyBean
    UserConfigSmtpMapper userConfigSmtpMapper;

    UserConfigSmtp userConfigSmtp = new UserConfigSmtp();

    @BeforeEach
    void setUp() {
        userConfigSmtp.setUserPk(2);
        userConfigSmtp.setHost("smtp.gmail.com");
        userConfigSmtp.setPort("03939");
        userConfigSmtp.setUsername("username");
        userConfigSmtp.setPassword("password");
        userConfigSmtp.setFromEmail("fromEmail");
        userConfigSmtp.setFromName("fromName");
        userConfigSmtp.setUseSSL(true);
    }

    @Test
    void selectById() {
        log.info("{}", userConfigSmtpMapper.selectById(1).orElseThrow());
    }

    @Test
    void selectByUserPk() {
        log.info("{}", userConfigSmtpMapper.selectByUserPk(2));
    }

    @Test
    void save() {
        userConfigSmtpMapper.save(userConfigSmtp);
    }

    @Test
    void update() {
        UserConfigSmtp stmp = new UserConfigSmtp();
        stmp.setId(1);
        stmp.setHost("smtp.gmail.com11");
        stmp.setPort("02323");
        stmp.setIsUse(false);
        userConfigSmtpMapper.update(stmp);
    }

    @Test
    void deleteByUserPk() {
        userConfigSmtpMapper.deleteByUserPk(2);
    }

    @Test
    void deleteById() {
        userConfigSmtpMapper.deleteById(1);
    }
}