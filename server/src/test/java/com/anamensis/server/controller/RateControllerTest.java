package com.anamensis.server.controller;

import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class RateControllerTest {

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

        wtc.delete()
            .uri("/api/rate/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk();

        wtc.delete()
            .uri("/api/rate/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk();

    }

    @Test
    @DisplayName("게시글 좋아요 수 조회")
    void hasRate() {
        wtc.get()
            .uri("/api/rate/add/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(1)
            .jsonPath("$.id").isEqualTo(1);

        wtc.get()
            .uri("/api/rate/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(1)
            .jsonPath("$.id").isEqualTo(1);
    }


    @Test
    @DisplayName("게시글 좋아요 수 추가")
    void addRate() {
        wtc.get()
            .uri("/api/rate/add/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(1)
            .jsonPath("$.id").isEqualTo(1);

        wtc.get()
            .uri("/api/rate/add/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(2)
            .jsonPath("$.id").isEqualTo(1);

    }

    @Test
    @DisplayName("게시글 좋아요 삭제")
    void deleteRate() {
        wtc.get()
            .uri("/api/rate/add/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(1)
            .jsonPath("$.id").isEqualTo(1);

        wtc.delete()
            .uri("/api/rate/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(false)
            .jsonPath("$.count").isEqualTo(0)
            .jsonPath("$.id").isEqualTo(1);

    }

    @Test
    @DisplayName("게시글 좋아요 수 조회")
    void countRate() {
        wtc.get()
            .uri("/api/rate/add/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(1)
            .jsonPath("$.id").isEqualTo(1);

        wtc.get()
            .uri("/api/rate/add/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo(true)
            .jsonPath("$.count").isEqualTo(2)
            .jsonPath("$.id").isEqualTo(1);

        wtc.get()
            .uri("/api/rate/count/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.count").isEqualTo(2)
            .jsonPath("$.id").isEqualTo(1);

        wtc.delete()
            .uri("/api/rate/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk();

        wtc.get()
                .uri("/api/rate/count/1")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.count").isEqualTo(1)
                .jsonPath("$.id").isEqualTo(1);
    }
}