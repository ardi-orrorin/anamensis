package com.anamensis.server.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SmtpPushHistoryServiceTest {

    @SpyBean
    SmtpPushHistoryService sm;

    @Test
    void findByUserPk() {
        sm.findByUserPk(1).log().subscribe();
    }

    @Test
    void findById() {
        sm.findById(357).log().subscribe();
    }
}