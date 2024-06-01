package com.anamensis.server.controller;

import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EmailVerifyControllerTest {

    @LocalServerPort
    int port;


    @Value("${test.email-verify.email}")
    private String EMAIL;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);

    WebTestClient wtc;

    @BeforeEach
    @Order(1)
    void setUp() {
        wtc = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    @DisplayName("이메일 인증 테스트")
    @Disabled("비용 발생 하는 테스트")
    void verify() {
        Map<String, Object> body = new HashMap<>();
        body.put("email", EMAIL);

        wtc.post()
            .uri("/public/api/verify/email")
            .bodyValue(body)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .consumeWith(response -> {
                String result = new String(Objects.requireNonNull(response.getResponseBody()));
                log.info("result: {}", result);
                assertNotNull(result);
            });
    }

    @Test
    @DisplayName("이메일 코드 검증 테스트")
    @Disabled("비용 발생 하는 테스트")
    void verifyCode() {
        Map<String, Object> body = new HashMap<>();
        body.put("email", EMAIL);

        wtc.post()
                .uri("/public/api/verify/email")
                .bodyValue(body)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    String result = new String(Objects.requireNonNull(response.getResponseBody()));
                    assertNotNull(result);
                    body.put("code", result);
                });

        wtc.post()
            .uri("/public/api/verify/verifyCode")
            .bodyValue(body)
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        body.put("code", "123412");

        wtc.post()
            .uri("/public/api/verify/verifyCode")
            .bodyValue(body)
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);



    }
}