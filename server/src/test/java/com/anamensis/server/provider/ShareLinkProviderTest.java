package com.anamensis.server.provider;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

class ShareLinkProviderTest {

    private Random rdm = new Random();

    Logger log = org.slf4j.LoggerFactory.getLogger(ShareLinkProviderTest.class);

    @Test
    char generateChar() {
        int c = (int) rdm.nextInt(26) + 65;

        char result = rdm.nextInt(2) == 0 ? (char) c : (char) (c + 32);

        return result;
    }

    @Test
    void generateShareLink() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 15; i++) {
            sb.append(generateChar());
        }

        log.info("shareLink : " + sb);

    }

}