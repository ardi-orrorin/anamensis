package com.anamensis.server.provider;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class EmailVerifyProviderTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(EmailVerifyProviderTest.class);

    private final String[] KEYS = {"0","1", "2", "3", "4", "5", "6", "7", "8", "9"};

    private final Random rdm = new Random();

    @SpyBean
    EmailVerifyProvider emailVerifyProvider;


    @Test
    String generateKey() {
        int keyIndex = rdm.nextInt(KEYS.length);
        String key = KEYS[keyIndex];

        log.info("key: {}", key);
        return key;
    }

    @Test
    void generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(generateKey());
        }
        log.info("code: {}", sb.toString());
    }

    @Test
    void generateCodeTest() {
        String code = emailVerifyProvider.generateCode();
        log.info("code: {}", code);
    }




}