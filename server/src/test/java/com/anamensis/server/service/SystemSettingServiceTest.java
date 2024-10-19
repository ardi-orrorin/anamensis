package com.anamensis.server.service;

import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.provider.MailProvider;
import org.json.JSONObject;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SystemSettingServiceTest {

    @SpyBean
    private SystemSettingService sss;


    @Autowired
    MailProvider mailProvider;

    Logger log = org.slf4j.LoggerFactory.getLogger(SystemSettingServiceTest.class);

    @Test
    void findAll() {
        StepVerifier.create(sss.findAll())
                .assertNext(list -> {

                    log.info("list: {}", list);
                    assertEquals(1, list.size());
                    assertEquals(SystemSettingKey.SMTP, list.getFirst().getKey());
                })
                .verifyComplete();

    }

    @Test
    void findByKey() {
        StepVerifier.create(sss.findByKey(SystemSettingKey.SMTP))
                .assertNext(systemSetting -> {
                    assertEquals(SystemSettingKey.SMTP, systemSetting.getKey());
                })
                .verifyComplete();
    }

    @Test
    void initSystemSetting() {
        StepVerifier.create(sss.initSystemSetting(SystemSettingKey.SMTP))
                .assertNext(aBoolean -> {
                    assertTrue(aBoolean);
                })
                .verifyComplete();
    }

    @Test
    void saveSystemSetting() {
        JSONObject value = new JSONObject();
        value.put("host", "smtp.gmail.com");
        value.put("port", 587);
        value.put("username", "username");
        value.put("password", "password");


        StepVerifier.create(sss.saveSystemSetting(SystemSettingKey.SMTP, value))
                .expectErrorMatches(throwable -> throwable.getMessage().equals("Failed to connect to SMTP server"))
                .verify();

        value.put("username", "username");
        value.put("password", "real password test");

        StepVerifier.create(sss.saveSystemSetting(SystemSettingKey.SMTP, value))
                .assertNext(systemSetting -> {
                    assertEquals(SystemSettingKey.SMTP, systemSetting.getKey());
                })
                .verifyComplete();

        MailProvider.MailMessage mailMessage = new MailProvider.MailMessage(
            "yoosc89@gmail.com",
            "test",
            "text test"
        );
        StepVerifier.create(mailProvider.sendMessage(mailMessage))
                .assertNext(aBoolean -> {
                    assertTrue(aBoolean);
                })
                .verifyComplete();

    }
}