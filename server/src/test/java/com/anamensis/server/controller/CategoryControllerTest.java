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
class CategoryControllerTest {

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
    @Disabled
    void getAllCategories() {
    }

    @Test
    @DisplayName("카테고리를 추가한다.")
    void insertCategory() {
        Map<String, String> map = new HashMap<>();
        map.put("name", "test");
        wtc.post()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("CREATED")
            .jsonPath("$.body.name").isEqualTo("test");

        map.put("name", "test2");
        map.put("parentId", "0");
        wtc.post()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("BAD_REQUEST")
            .jsonPath("$.body.name").isEqualTo("test2");

        map.put("name", "test3");
        map.put("parentId", "1");
        wtc.post()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("CREATED")
            .jsonPath("$.body.name").isEqualTo("test3");

        map.put("name", "test4");
        map.put("parentId", "99");
        wtc.post()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("BAD_REQUEST")
            .jsonPath("$.message").isEqualTo("Bad Request");

        map.put("name", null);
        map.put("parentId", null);
        wtc.post()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isBadRequest();
    }

    @Test
    @DisplayName("카테고리를 수정한다.")
    void updateCategory() {

        Map<String, String> map = new HashMap<>();
        map.put("id", "1");
        map.put("name", "test11");
        wtc.put()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("OK")
            .jsonPath("$.body.name").isEqualTo("test11");

        map.put("id", "1");
        map.put("name", "test12");
        map.put("parentId", "0");
        wtc.put()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("BAD_REQUEST")
            .jsonPath("$.body.name").isEqualTo("test12");


        map.put("id", "2");
        map.put("name", "test13");
        map.put("parentId", null);
        wtc.put()
            .uri("/api/categories")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("OK")
            .jsonPath("$.body.name").isEqualTo("test13");

        map.put("id", "12");
        map.put("name", "test14");
        wtc.put()
                .uri("/api/categories")
                .body(BodyInserters.fromValue(map))
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.status").isEqualTo("BAD_REQUEST")
                .jsonPath("$.body.name").isEqualTo("test14");
    }

    @Test
    @DisplayName("카테고리를 삭제한다.")
    void deleteCategory() {

        wtc.delete()
            .uri("/api/categories/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("BAD_REQUEST")
            .jsonPath("$.body").isEqualTo(1);

        wtc.delete()
            .uri("/api/categories/10")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("OK")
            .jsonPath("$.body").isEqualTo(10);


        wtc.delete()
                .uri("/api/categories/10")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.status").isEqualTo("BAD_REQUEST")
                .jsonPath("$.body").isEqualTo(10);
    }
}