package com.anamensis.server.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@Slf4j
public class ShareLinkProvider {

    private final Random rdm = new Random();

    public String generateShareLink() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 15; i++) {
            sb.append(generateChar());
        }
        return sb.toString();
    }

    private char generateChar() {
        int c = rdm.nextInt(26) + 65;

        char result = rdm.nextInt(2) == 0 ? (char) c : (char) (c + 32);

        return result;
    }
}
