package com.anamensis.server.mapper;

import com.anamensis.server.entity.UserConfigSmtp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

@SpringBootTest
class MemberConfigSmtpMapperTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(MemberConfigSmtpMapperTest.class);

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
        userConfigSmtp.setIsDefault(true);
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
        stmp.setId(12);
        stmp.setHost("smtp.gmail.com11");
        stmp.setPort("02323");
        stmp.setIsUse(false);
        stmp.setIsDefault(true);
        stmp.setUserPk(2);
        log.info("{}", stmp);
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

    @Test
    void updateDefaultInit() {
        userConfigSmtpMapper.updateDefaultInit(2);
    }

    @Test
    void disabled() {
        userConfigSmtpMapper.disabled(12, 2);
    }

    @Test
    void selectFirstId() {
        log.info("{}", userConfigSmtpMapper.selectFirstId(2));
    }

    @Test
    void isDefault() {
        log.info("{}", userConfigSmtpMapper.isDefault(2, 12));
    }
}