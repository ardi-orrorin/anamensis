package com.anamensis.server.service;

import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LoginHistoryServiceTest {


    @SpyBean
    private LoginHistoryService loginHistoryService;

    @Test
    void save() {
        User user = User.builder()
                .id(2)
                .userId("admin")
                .pwd("admin")
                .name("admin")
                .isUse(true)
                .build();

        LoginHistory loginHistory = LoginHistory.builder()
                .ip("111.111.1.1")
                .device("chrome")
                .location("seoul")
                .build();

        loginHistoryService.save(loginHistory, user);
    }
}