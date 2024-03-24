package com.anamensis.server.service;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @SpyBean
    private UserService userService;


    private Logger log = org.slf4j.LoggerFactory.getLogger(UserServiceTest.class);


    @Test
    void findUserByUserIdAndPwd() {
        log.info(userService.findUserByUserIdAndPwd("admin", "admin"));

    }

    @Test
    void findByUsername() {
    }
}