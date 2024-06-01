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
class AttendanceControllerTest {
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
    @DisplayName("출석체크 정보 조회")
    void info() {
        wtc.get()
            .uri("/api/attendance")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.userId").isEqualTo("d-member-1")
            .jsonPath("$.email").isEqualTo("d-member-1@gmail.com")
            .jsonPath("$.days").isEqualTo(1);

        wtc.get()
            .uri("/api/attendance")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.userId").isEqualTo("d-member-2")
            .jsonPath("$.email").isEqualTo("d-member-2@gmail.com");
    }

    @Test
    @DisplayName("출석체크")
    void update() {
        wtc.get()
            .uri("/api/attendance/check")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError()
            .expectBody(String.class)
            .isEqualTo("오늘은 이미 출석 했습니다.");

        wtc.get()
            .uri("/api/attendance/check")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .isEqualTo("success");


        wtc.get()
            .uri("/api/attendance")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.userId").isEqualTo("d-member-2")
            .jsonPath("$.email").isEqualTo("d-member-2@gmail.com")
            .jsonPath("$.days").isEqualTo(2);

    }
}