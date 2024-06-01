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
class BoardControllerTest {

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
    @DisplayName("게시판 목록을 조회한다.")
    void findAll() {
        wtc.get()
            .uri("/public/api/boards")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.content[0].id").isEqualTo(10)
            .jsonPath("$.content[1].id").isEqualTo(9)
            .jsonPath("$.content[2].id").isEqualTo(8)
            .jsonPath("$.page.total").isEqualTo(10);


        wtc.get()
                .uri(uri ->
                     uri.path("/public/api/boards")
                        .queryParam("page", 2)
                        .queryParam("size", 3)
                        .build()
                )
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content[0].id").isEqualTo(7)
                .jsonPath("$.content[1].id").isEqualTo(6)
                .jsonPath("$.content[2].id").isEqualTo(5)
                .jsonPath("$.page.total").isEqualTo(10);

        wtc.get()
            .uri(uri ->
                uri.path("/public/api/boards")
                    .queryParam("page", 1)
                    .queryParam("size", 3)
                    .queryParam("title", "제목1")
                    .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.content[0].id").isEqualTo(10)
            .jsonPath("$.content[1].id").isEqualTo(1)
            .jsonPath("$.page.total").isEqualTo(2);

        wtc.get()
                .uri(uri ->
                    uri.path("/public/api/boards")
                        .queryParam("page", 1)
                        .queryParam("size", 3)
                        .queryParam("title", "제목2")
                        .build()
                )
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.content[0].id").isEqualTo(2)
                .jsonPath("$.page.total").isEqualTo(1);
    }

    @Test
    @DisplayName("게시글을 조회한다.")
    void findByPk() {
        wtc.get()
            .uri("/public/api/boards/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(1)
            .jsonPath("$.title").isEqualTo("테스트 제목1")
            .jsonPath("$.writer").isEqualTo("d-member-1");

        wtc.get()
            .uri("/public/api/boards/2")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(2)
            .jsonPath("$.title").isEqualTo("테스트 제목2")
            .jsonPath("$.writer").isEqualTo("d-member-1");

        wtc.get()
            .uri("/public/api/boards/10")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(10)
            .jsonPath("$.title").isEqualTo("테스트 제목10")
            .jsonPath("$.writer").isEqualTo("d-member-4");
    }

    @Test
    @DisplayName("자신의 최근 게시글 최대 5개 조회")
    void findByUserPk() {
        wtc.get()
            .uri("/api/boards/summary")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[0].id").value(id -> {
                assertTrue((int) id >= 4);
            });


        wtc.get()
            .uri("/api/boards/summary")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[0].id").isEqualTo(7)
            .jsonPath("$[1].id").isEqualTo(6)
            .jsonPath("$[2].id").isEqualTo(5);
    }

    @Test
    @DisplayName("게시글을 등록한다.")
    void save() {
        Map<String, Object> map = new HashMap<>();
        map.put("title", "테스트 제목11");
        map.put("categoryPk", "1");

        Map<String, Object> content = new HashMap<>();
        content.put("type", "text");

        map.put("content", content);
        wtc.post()
            .uri("/api/boards")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    @DisplayName("게시글을 수정한다.")
    void updateByPk() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", "1");
        map.put("title", "테스트 제목1-1");
        map.put("categoryPk", "1");

        Map<String, Object> content = new HashMap<>();
        content.put("type", "text");

        map.put("content", content);
        wtc.put()
            .uri("/api/boards/1")
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("SUCCESS")
            .jsonPath("$.message").isEqualTo("게시글이 수정 되었습니다.");


        wtc.put()
                .uri("/api/boards/1")
                .body(BodyInserters.fromValue(map))
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token2);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.status").isEqualTo("FAIL")
                .jsonPath("$.message").isEqualTo("게시글 수정에 실패하였습니다.");


        wtc.get()
            .uri("/public/api/boards/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.id").isEqualTo(1)
            .jsonPath("$.title").isEqualTo("테스트 제목1-1")
            .jsonPath("$.writer").isEqualTo("d-member-1");
    }

    @Test
    @DisplayName("게시글을 삭제한다.")
    void disableByPk() {
        wtc.delete()
            .uri("/api/boards/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("SUCCESS")
            .jsonPath("$.message").isEqualTo("게시글이 삭제 되었습니다.");

        wtc.get()
            .uri("/public/api/boards/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isBadRequest();

        wtc.delete()
            .uri("/api/boards/1")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("FAIL")
            .jsonPath("$.message").isEqualTo("게시글 삭제에 실패하였습니다.");
    }
}