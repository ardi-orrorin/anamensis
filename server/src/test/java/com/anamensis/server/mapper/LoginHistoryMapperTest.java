package com.anamensis.server.mapper;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

@SpringBootTest
class LoginHistoryMapperTest {

    @SpyBean
    private LoginHistoryMapper loginHistoryMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(LoginHistoryMapperTest.class);

    @Test
    void save() {

//        User user = User.builder()
//                .id(2)
//                .userId("admin")
//                .pwd("admin")
//                .name("admin")
//                .isUse(true)
//                .build();
//
//        LoginHistory loginHistory = LoginHistory.builder()
//                .ip("111.111.1.1")
//                .device("chrome")
//                .location("seoul")
//                .build();
//
//        loginHistoryMapper.save(loginHistory, user);
    }

    @Test
    void count() {
//        User user = User.builder()
//                .id(2)
//                .userId("admin")
//                .pwd("admin")
//                .name("admin")
//                .isUse(true)
//                .build();
//
//        int count = loginHistoryMapper.count(user.getId());
//
//        log.info("count: {}", count);
    }

    @Test
    void selectAll() {
//        User user = User.builder()
//                .id(2)
//                .userId("admin")
//                .pwd("admin")
//                .name("admin")
//                .isUse(true)
//                .build();
//
//        Page page = new Page();
//        page.setPage(1);
//        page.setSize(10);
//
//        loginHistoryMapper.selectAll(user, page).forEach(loginHistory -> {
//            log.info("loginHistory: {}", loginHistory);
//        });

    }
}