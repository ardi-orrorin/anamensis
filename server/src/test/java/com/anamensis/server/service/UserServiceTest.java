package com.anamensis.server.service;

import com.anamensis.server.entity.User;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @SpyBean
    private UserService userService;

    @SpyBean
    private BCryptPasswordEncoder encoder;


    private Logger log = org.slf4j.LoggerFactory.getLogger(UserServiceTest.class);


    @Test
    void findUserByUserIdAndPwd() {
        userService.findUserByUserId("admin", "admin")
                .log();

    }

    @Test
    void findByUsername() {
    }

    @Test
    void save() {
        String encodePwd = encoder.encode("admin3");
        User user = User.builder()
                .userId("admin3")
                .pwd(encodePwd)
                .name("admin")
                .email("test@test1.com")
                .phone("010-1111-1112")
                .isUse(true)
                .build();
        userService.saveUser(Mono.just(user));
    }

    @Test
    void testFindByUsername() {
        userService.findByUsername("admin")
                .log()
                .subscribe();
    }
}