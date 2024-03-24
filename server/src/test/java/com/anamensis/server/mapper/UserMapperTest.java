package com.anamensis.server.mapper;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;


@SpringBootTest
@ActiveProfiles("local")
class UserMapperTest {

    @SpyBean
    private UserMapper userMapper;

    private Logger log = org.slf4j.LoggerFactory.getLogger(UserMapperTest.class);

    @Test
    void findAllUsers() {
        log.info("{}", userMapper.findAllUsers());
    }

    @Test
    void findUserByUserId() {
        log.info("{}", userMapper.findUserByUserId("admin"));
//        userMapper.findUserByUserId("admin");
    }

    @Test
    void findUserByUserIdAndPwd() {
        log.info("{}", userMapper.findUserByUserIdAndPwd("admin", ""));
    }
}