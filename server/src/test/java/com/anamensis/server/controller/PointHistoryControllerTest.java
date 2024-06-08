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
class PointHistoryControllerTest {

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
    @DisplayName("포인트 히스토리 조회")
    void getPointHistories() {
        wtc.get()
                .uri("/api/point-histories")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.page.total").isEqualTo(3)
                .jsonPath("$.content.length()").isEqualTo(3)
                .jsonPath("$.content[0].id").isEqualTo(3);

        wtc.get()
                .uri(uriBuilder -> {
                    return uriBuilder
                            .path("/api/point-histories")
                            .queryParam("page", 1)
                            .queryParam("size", 2)
                            .build();
                })
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.page.total").isEqualTo(3)
                .jsonPath("$.content.length()").isEqualTo(2)
                .jsonPath("$.content[0].id").isEqualTo(3);

        wtc.get()
                .uri(uriBuilder -> {
                    return uriBuilder
                            .path("/api/point-histories")
                            .queryParam("pointCodeName", "attend-1")
                            .build();
                })
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.page.total").isEqualTo(1)
                .jsonPath("$.content.length()").isEqualTo(1)
                .jsonPath("$.content[0].id").isEqualTo(1);

        wtc.get()
                .uri(uriBuilder -> {
                    return uriBuilder
                            .path("/api/point-histories")
                            .queryParam("tableName", "board")
                            .build();
                })
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.page.total").isEqualTo(3)
                .jsonPath("$.content.length()").isEqualTo(3)
                .jsonPath("$.content[0].id").isEqualTo(3);

        wtc.get()
                .uri("/api/point-histories")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.page.total").isEqualTo(2)
                .jsonPath("$.content.length()").isEqualTo(2)
                .jsonPath("$.content[0].id").isEqualTo(5);



    }
}