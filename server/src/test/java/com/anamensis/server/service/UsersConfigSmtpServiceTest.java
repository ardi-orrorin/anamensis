package com.anamensis.server.service;

import com.anamensis.server.entity.UserConfigSmtp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import reactor.core.publisher.Mono;

@SpringBootTest
class UsersConfigSmtpServiceTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(UsersConfigSmtpServiceTest.class);

    @SpyBean
    UserConfigSmtpService userConfigSmtpService;

    UserConfigSmtp userConfigSmtp = new UserConfigSmtp();

    @BeforeEach
    void setUp() {
        userConfigSmtp.setUserPk(2);
        userConfigSmtp.setHost("smtp.gmail.com");
        userConfigSmtp.setPort("03939");
        userConfigSmtp.setUsername("username");
        userConfigSmtp.setPassword("password");
        userConfigSmtp.setFromEmail("fromEmail");
        userConfigSmtp.setFromName("fromName");
        userConfigSmtp.setUseSSL(true);
        userConfigSmtp.setIsDefault(true);
    }

    @Test
    void selectByUserPk() {
        userConfigSmtpService.selectByUserPk(2L)
                .subscribe(userConfigSmtp -> log.info("{}", userConfigSmtp));
    }

    @Test
    void selectById() {
        userConfigSmtpService.selectById(10L)
                .subscribe(userConfigSmtp -> log.info("{}", userConfigSmtp));

    }

    @Test
    void save() {
        Mono<UserConfigSmtp> userConfigSmtpMono = Mono.just(userConfigSmtp);
        userConfigSmtpMono.flatMap(userConfigSmtpService::save)
                .subscribe(userConfigSmtp -> log.info("{}", userConfigSmtp));
    }

    @Test
    void update() {
        UserConfigSmtp stmp = new UserConfigSmtp();
        stmp.setId(10); // error 10 not found
//        stmp.setId(9); // error 10 not found
        stmp.setHost("gmail.com11");
        stmp.setPort("02323");
        stmp.setUsername("test");
        stmp.setPassword("test");
        stmp.setIsUse(false);

        userConfigSmtpService.update(stmp)
                .subscribe(r -> log.info("{}", r));
    }


    @Test
    void deleteByUserPk() {
    }

    @Test
    void deleteById() {
    }

    @Test
    void disabled() {
        userConfigSmtpService.disabled(12, 2)
                .subscribe();
    }

    @Test
    void initDefault() {
//        userConfigSmtpService.initDefault(2);
    }
}