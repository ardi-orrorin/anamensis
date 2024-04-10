package com.anamensis.server.service;

import com.anamensis.server.entity.SmtpPush;
import com.anamensis.server.entity.UserConfigSmtp;
import com.anamensis.server.mapper.SmtpPushMapper;
import com.anamensis.server.provider.MailProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;


@SpringBootTest
class SmtpPushServiceTest {

    @SpyBean
    SmtpPushService smtpPushService;

    @SpyBean
    UserConfigSmtpService userConfigSmtpService;

    @SpyBean
    SmtpPushMapper smtpPushMapper;

    SmtpPush smtpPush = new SmtpPush();

    UserConfigSmtp userConfigSmtp = new UserConfigSmtp();

    @BeforeEach
    void setUp() {
        smtpPush = new SmtpPush();
//        smtpPush.setUserPk(2);
        smtpPush.setSubject("Test");
        smtpPush.setContent("Hello World");
//        smtpPush.setCreateAt(LocalDateTime.now());
//        smtpPush.setUserConfigSmtpPk(1);

        userConfigSmtp = userConfigSmtpService.selectById(1).block();

    }

    @Test
    void save() {
        SmtpPush smtpPush = new SmtpPush();
        smtpPush.setUserPk(2);
        smtpPush.setSubject("Test");
        smtpPush.setContent("Hello World");
        smtpPush.setCreateAt(LocalDateTime.now());
        smtpPush.setUserConfigSmtpPk(1);

        UserConfigSmtp userConfigSmtp = userConfigSmtpService.selectById(1).block();


        new MailProvider.Builder()
                .config(userConfigSmtp)
                .message(userConfigSmtp, smtpPush.getSubject(), smtpPush.getContent())
                .build()
                .send();

        smtpPushMapper.save(smtpPush);
    }

    @Test
    void saveTest(){
        smtpPushService.send(userConfigSmtp, smtpPush)
                .subscribe();
    }

}