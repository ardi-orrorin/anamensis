package com.anamensis.server.controller;

import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
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
class UserConfigSmtpControllerTest {

    @Value("${test.smtp.host}")
    String SMTP_HOST;

    @Value("${test.smtp.port}")
    String SMTP_PORT;

    @Value("${test.smtp.username}")
    String SMTP_USERNAME;

    @Value("${test.smtp.password}")
    String SMTP_PASSWORD;

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
        map2.put("authType", "email");
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
    @DisplayName("회원별 유저 설정 전체 조회")
    void list() {
        wtc.get()
            .uri("/api/user-config-smtp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.content").isArray()
            .jsonPath("$.content[0].id").isEqualTo(1)
            .jsonPath("$.content[1].id").isEqualTo(2)
            .jsonPath("$.content[2].id").isEqualTo(3);

        wtc.get()
            .uri("/api/user-config-smtp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.content").isArray()
            .jsonPath("$.content[0].id").isEqualTo(4)
            .jsonPath("$.content[1].id").isEqualTo(5);

    }

    @Test
    @DisplayName("유저 설정 조회")
    void get() {
        wtc.get()
            .uri("/api/user-config-smtp/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(1);

        wtc.get()
            .uri("/api/user-config-smtp/2")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(2);

        wtc.get()
            .uri("/api/user-config-smtp/3")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(3);

        wtc.get()
                .uri("/api/user-config-smtp/4")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().is4xxClientError();

        wtc.get()
            .uri("/api/user-config-smtp/4")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(4);

        wtc.get()
            .uri("/api/user-config-smtp/5")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(5);


        wtc.get()
                .uri("/api/user-config-smtp/1")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().is4xxClientError();

    }

    @Test
    @DisplayName("유저 설정 저장")
    void save() {
        Map<String, Object> map = new HashMap<>();
        map.put("host", SMTP_HOST);
        map.put("port", SMTP_PORT);
        map.put("username", SMTP_USERNAME);
        map.put("password", SMTP_PASSWORD);
        map.put("useSSL", true);
        map.put("isDefault", true);

        saveApi(map);
        saveApi(map);

        map.put("isDefault", false);
        saveApi(map);

        map.put("useSSL", false);
        saveApi(map);

        map.put("password", "apsdfsd");
        saveApi(map);

        map.put("username", "sdfsdf");
        saveApi(map);

        map.put("port", "23232");
        saveApi(map);

        map.put("host", "sdfsdf");
        saveApi(map);

        map.put("port", "asdas");
        saveApi4xxError(map);

        map.put("port", "1".repeat(1));
        saveApi(map);

        map.put("port", "1".repeat(7));
        saveApi4xxError(map);

        map.put("port", "1".repeat(6));
        saveApi(map);

        map.put("port", null);
        saveApi4xxError(map);

        map.put("port", "12345");

        map.put("username", null);
        saveApi4xxError(map);

        map.put("username", "sdfsdf");

        map.put("host", null);
        saveApi4xxError(map);

        map.put("host", "sdfsdf");
        map.put("password", null);
        saveApi4xxError(map);

        map.put("password", "sdfsd");

        map.put("useSSL", null);
        saveApi4xxError(map);

        map.put("useSSL", true);

        map.put("isDefault", null);
        saveApi4xxError(map);

        map.put("isDefault", true);

        map.put("fromEmail", "sdfsdf");
        saveApi(map);

        map.put("fromName", "sdffsdf");
        saveApi(map);
    }

    void saveApi(Map<String, Object> map) {
        wtc.post()
            .uri("/api/user-config-smtp")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.host").isEqualTo(map.get("host"))
            .jsonPath("$.port").isEqualTo(map.get("port"))
            .jsonPath("$.username").isEqualTo(map.get("username"))
            .jsonPath("$.useSSL").isEqualTo(map.get("useSSL"))
            .jsonPath("$.isDefault").isEqualTo(map.get("isDefault"));
    }

    void saveApi4xxError(Map<String, Object> map) {
        wtc.post()
            .uri("/api/user-config-smtp")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();
    }

    @Test
    void update() {
    }

    @Test
    void disabled() {
    }

    @Test
    void testConnection() {
    }
}