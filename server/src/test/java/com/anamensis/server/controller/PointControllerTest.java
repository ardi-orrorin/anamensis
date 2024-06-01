package com.anamensis.server.controller;

import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PointControllerTest {

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
    @DisplayName("모든 포인트 코드를 조회한다.")
    void selectAll() {
        WebTestClient.BodyContentSpec content = wtc.get()
            .uri("/api/points")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody();

        IntStream.range(0, 10).forEach(i -> {
            content.jsonPath("$[" + i + "].id").isEqualTo(i + 1);
            content.jsonPath("$[" + i + "].name").isEqualTo("attend-" + (i + 1));
        });
    }

    @Test
    @DisplayName("포인트 코드를 추가한다.")
    void insert() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", 11);
        map.put("name", "attend-11");
        map.put("point", 100);
        map.put("isUse", true);

        wtc.post()
            .uri("/api/points")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri("/api/points")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[10].id").isEqualTo(11)
            .jsonPath("$[10].name").isEqualTo("attend-11");

    }

}