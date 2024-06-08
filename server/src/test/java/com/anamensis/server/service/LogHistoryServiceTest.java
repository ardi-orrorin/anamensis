package com.anamensis.server.service;

import com.anamensis.server.entity.LogHistory;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class LogHistoryServiceTest {

    @SpyBean
    LogHistoryService lhs;

    Logger log = org.slf4j.LoggerFactory.getLogger(LogHistoryServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("api 호출 로그 저장 테스트")
    void save() {
        LogHistory.LogHistoryBuilder builder = LogHistory.builder();

        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.memberPk(1L);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.createAt(LocalDateTime.now());
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.path("/api/test");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.method("GET");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.query("test=1");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.body("test");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.headers("test");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.session("test");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.remoteAddress("127.0.0.1");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.localAddress("127.0.0.1");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);


        builder.uri("http://localhost:8080/api/test");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyComplete();

        builder.body(null);
        log.info("builder : {} ", builder.build());
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyComplete();

        builder.query(null);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.query("");
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyComplete();

        builder.headers(null);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.remoteAddress(null);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.localAddress(null);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.session(null);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);

        builder.memberPk(0);
        StepVerifier.create(lhs.save(builder.build()))
                    .verifyError(RuntimeException.class);
    }
}