package com.anamensis.server.mapper;

import com.anamensis.server.entity.SmtpPush;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

@SpringBootTest
class SmtpPushHistoryMapperTest {

    @SpyBean
    SmtpPushMapper smtpPushHistoryMapper;

    @SpyBean
    SmtpPushHistoryMapper spHistoryMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(SmtpPushHistoryMapperTest.class);

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

    @Test
    void findByUserPk() {
        spHistoryMapper.findByUserPk(1).forEach(smtpPushHistory ->
                log.info(smtpPushHistory.toString())
        );

    }

    @Test
    void findById() {
        log.info(spHistoryMapper.findById(357).orElseThrow().toString());
    }

    @Test
    void countByUserPk() {
        log.info(String.valueOf(spHistoryMapper.countByUserPk(1)));
    }
}