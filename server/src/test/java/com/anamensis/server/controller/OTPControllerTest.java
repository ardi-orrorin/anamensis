package com.anamensis.server.controller;

import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OTPControllerTest {
    @LocalServerPort
    int port;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);

    WebTestClient wtc;

    String token = "";

    String token2 = "";

    @BeforeEach
    @Order(1)
    void setUp() {
        wtc = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();

        Map<String, String> map = new HashMap<>();
        map.put("username", "d-member-1");
        map.put("password", "d-member-1");
        map.put("authType", "NONE");
        map.put("code", "0");
        wtc.post()
            .uri("/public/api/user/verify")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.set("Device", "chrome");
                httpHeaders.set("Location", "seoul");
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.Login.class)
            .consumeWith(result ->
                    token = Objects.requireNonNull(result.getResponseBody()).getAccessToken()
            );

        Map<String, String> map2 = new HashMap<>();
        map2.put("username", "d-member-2");
        map2.put("password", "d-member-2");
        map2.put("authType", "EMAIL");
        map2.put("code", "0");
        wtc.post()
            .uri("/public/api/user/verify")
            .body(BodyInserters.fromValue(map2))
            .headers(httpHeaders -> {
                httpHeaders.set("Device", "chrome");
                httpHeaders.set("Location", "seoul");
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.Login.class)
            .consumeWith(result ->
                    token2 = Objects.requireNonNull(result.getResponseBody()).getAccessToken()
            );

    }

    @Test
    @DisplayName("OTP를 생성한다.")
    void generate() {
        wtc.get()
            .uri("/api/otp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .consumeWith(result -> {
                assertTrue(result.getResponseBody().contains("https://"));
            });

        wtc.get()
            .uri("/api/otp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .consumeWith(result -> {
                assertTrue(result.getResponseBody().contains("https://"));
            });

        wtc.get()
            .uri("/api/otp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .consumeWith(result -> {
                assertTrue(result.getResponseBody().contains("https://"));
            });

        wtc.get()
            .uri("/api/otp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .consumeWith(result -> {
                assertTrue(result.getResponseBody().contains("https://"));
            });
    }

    @Test
    @DisplayName("OTP가 존재하는지 확인한다.")
    void exist() {
        wtc.get()
            .uri("/api/otp/exist")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri("/api/otp/exist")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);
    }

    @Test
    @DisplayName("OTP를 비활성화한다.")
    void disable() {
        wtc.get()
            .uri("/api/otp/exist")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.delete()
            .uri("/api/otp/disable")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri("/api/otp/exist")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);


        wtc.get()
                .uri("/api/otp/exist")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class)
                .isEqualTo(true);

        wtc.delete()
                .uri("/api/otp/disable")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class)
                .isEqualTo(true);

        wtc.get()
                .uri("/api/otp/exist")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class)
                .isEqualTo(false);
    }


    @Test
    @DisplayName("OTP를 검증한다.")
    @Disabled
    void verify() {
        Map<String, Integer> map = new HashMap<>();
        map.put("code", 123456);

        wtc.post()
            .uri("/api/otp/verify")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(map))
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);

        wtc.post()
                .uri("/api/otp/verify")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .body(BodyInserters.fromValue(map))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class)
                .isEqualTo(false);

    }
}