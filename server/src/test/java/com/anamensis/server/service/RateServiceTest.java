package com.anamensis.server.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class RateServiceTest {

    @SpyBean
    private RateService rateService;

    @Test
    void addRate() {
        rateService.addRate(1, 1)
                .log()
                .subscribe();
    }

    @Test
    void removeRate() {
        rateService.removeRate(1, 1)
                .log()
                .subscribe();
    }

    @Test
    void hasRate() {
        rateService.hasRate(1, 1)
                .log()
                .subscribe();
    }

    @Test
    void countRate() {
        rateService.countRate(1)
                .log()
                .subscribe();
    }
}