package com.anamensis.server.mapper;

import com.anamensis.server.entity.SmtpPush;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

@SpringBootTest
class SmtpPushHistoryMapperTest {

    @SpyBean
    SmtpPushMapper smtpPushHistoryMapper;

    @Test
    void insert() {
        SmtpPush smtpPushHistory = new SmtpPush();
        smtpPushHistory.setUserPk(2);
        smtpPushHistory.setUserConfigSmtpPk(1);
        smtpPushHistory.setSubject("subject");
        smtpPushHistory.setContent("content");
        smtpPushHistory.setCreateAt(LocalDateTime.now());
        smtpPushHistoryMapper.save(smtpPushHistory);
    }

}