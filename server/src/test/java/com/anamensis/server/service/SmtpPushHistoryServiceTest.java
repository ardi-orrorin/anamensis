package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
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
        Page page = new Page();
        page.setPage(1);
        page.setSize(10);
        sm.findByUserPk(1,page).log().subscribe();
    }

    @Test
    void findById() {
        sm.findById(357).log().subscribe();
    }
}