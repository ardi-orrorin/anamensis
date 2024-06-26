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
class BoardCommentControllerTest {

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
    @DisplayName("댓글 목록")
    @Order(2)
    void list() {
        wtc.get()
            .uri(uriBuilder -> uriBuilder
                .path("/public/api/board/comments")
                .queryParam("boardPk", 1)
                .build()
            )
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.length()")
                .value(e -> assertTrue((int) e >=3))
            .jsonPath("$[0].id").isEqualTo(1)
            .jsonPath("$[0].writer").isEqualTo("d-member-1");



        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/public/api/board/comments")
                    .queryParam("boardPk", 2)
                    .build()
            )
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.length()")
                .value(e -> assertTrue((int) e >= 3))
            .jsonPath("$[0].id").isEqualTo(7)
            .jsonPath("$[1].id").isEqualTo(8)
            .jsonPath("$[2].id").isEqualTo(9);

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/public/api/board/comments")
                    .queryParam("boardPk", 1)
                    .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[0].isWriter").isEqualTo(true)
            .jsonPath("$[1].isWriter").isEqualTo(false);

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/public/api/board/comments")
                    .queryParam("boardPk", 1)
                    .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[0].isWriter").isEqualTo(false)
            .jsonPath("$[1].isWriter").isEqualTo(true);

    }

    @Test
    @DisplayName("댓글 저장")
    @Order(3)
    void save() {
        Map<String, Object> map = new HashMap<>();
        map.put("boardPk", 1);
        map.put("content", "테스트 댓글7");
        map.put("blockSeq", 1);

        wtc.post()
            .uri("/api/board/comments")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri("/api/user/info")
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.MyPage.class)
            .consumeWith(result -> {
                assertTrue(result.getResponseBody().getPoint() > 0);
            });

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/public/api/board/comments")
                    .queryParam("boardPk", 1)
                    .build()
            )
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.length()")
                .value(e -> assertTrue((int) e >= 5))
            .jsonPath("$[5].writer").isEqualTo("d-member-1")
            .jsonPath("$[5].content").isEqualTo("테스트 댓글7")
            .jsonPath("$[5].blockSeq").isEqualTo("1");

        map.put("content", null);
        wtc.post()
            .uri("/api/board/comments")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isBadRequest();

        map.put("content", "테스트 댓글8");
        map.put("boardPk", null);

        wtc.post()
            .uri("/api/board/comments")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isBadRequest();



    }

    @Test
    @DisplayName("댓글 삭제")
    @Order(1)
    void delete() {
        wtc.delete()
            .uri("/api/board/comments/10")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/public/api/board/comments")
                    .queryParam("boardPk", 2)
                    .build()
            )
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.length()")
            .value(e -> assertTrue(((int) e) >= 3));


        wtc.delete()
            .uri("/api/board/comments/6")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);


        wtc.delete()
            .uri("/api/board/comments/2")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/public/api/board/comments")
                    .queryParam("boardPk", 2)
                    .build()
            )
            .exchange()
            .expectStatus().isOk()
            .expectBody()
                .jsonPath("$.length()")
                .value(e -> assertTrue((int) e >= 3));


        wtc.delete()
                .uri("/api/board/comments/6")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class)
                .isEqualTo(false);


        wtc.delete()
            .uri("/api/board/comments/99")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);
    }
}