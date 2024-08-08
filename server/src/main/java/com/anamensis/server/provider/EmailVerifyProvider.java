package com.anamensis.server.provider;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class EmailVerifyProvider {

    private final String[] KEYS = {"0","1", "2", "3", "4", "5", "6", "7", "8", "9"};

    private final Random rdm;

    public String generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(generateKey());
        }
        return sb.toString();
    }

    private String generateKey() {
        int keyIndex = rdm.nextInt(KEYS.length);

        return KEYS[keyIndex];
    }
}
