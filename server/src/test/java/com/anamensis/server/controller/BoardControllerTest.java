package com.anamensis.server.controller;

import com.anamensis.server.config.PathRequestMappingConfig;
import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.BoardResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.Board;
import com.anamensis.server.resultMap.BoardResultMap;
import jakarta.annotation.security.RunAs;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.StatusAssertions;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class BoardControllerTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(BoardControllerTest.class);

    @LocalServerPort
    int port;

    WebTestClient webTestClient;

    @BeforeEach
    @Order(1)
    void setUp() {
        webTestClient = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    Token token;

    @BeforeEach
    @Order(2)
    void setToken() {
        UserRequest.Login login = new UserRequest.Login();
        login.setUsername("admin1");
        login.setPassword("adminAdmin1");
        login.setAuthType("NONE");

        EntityExchangeResult<UserResponse.Login> result =
                webTestClient.post()
                        .uri("/public/api/user/verify")
                        .headers(httpHeaders -> {
                            httpHeaders.set("Device", "chrome");
                            httpHeaders.set("Location", "seoul");
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(login)
                        .exchange()
                        .expectStatus().isOk()
                        .expectBody(UserResponse.Login.class)
                        .returnResult();

        token = Token.builder()
                .accessToken(result.getResponseBody().getAccessToken())
                .refreshToken(result.getResponseBody().getRefreshToken())
                .build();
    }

    @DisplayName("게시판 목록 조회")
    @RepeatedTest(100)
    void findAll() {
        webTestClient.get()
                .uri("/public/api/boards")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    assertNotNull(response.getResponseBody());
                });

        webTestClient.get()
                .uri(uriBuilder -> {
                    return uriBuilder
                            .path("/public/api/boards")
                            .queryParam("page", 2)
                            .queryParam("size", 20)
                            .build();
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    assertNotNull(response.getResponseBody());
                });
    }

    @DisplayName("게시판 상세 조회 성공")
    @RepeatedTest(1000)
    void findByPkSuccess() {
        webTestClient.get()
                .uri("/public/api/boards/30")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info("response: {}", response);
                    assertNotNull(response.getResponseBody());
                });
    }
    @DisplayName("게시판 상세 조회 실패")
    @RepeatedTest(10)
    void findByPkFail() {
        webTestClient.get()
                .uri("/public/api/boards/0")
                .exchange()
                .expectStatus().is5xxServerError()
                .expectBody().consumeWith(response -> {
                    log.info("response: {}", response);
                    assertNotNull(response.getResponseBody());
                });
    }

    @Test
    @DisplayName("게시판 비활성화 성공")
    void disableByPkSuccess() {
        webTestClient.delete()
            .uri("/api/boards/8")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token.getAccessToken());
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status")
            .isEqualTo("SUCCESS");
    }

    @Test
    @DisplayName("게시판 비활성화 실패")
    void disableByPkFail() {
        webTestClient.delete()
            .uri("/api/boards/6")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token.getAccessToken());
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status")
            .isEqualTo("FAIL");
    }

    @Test
    @DisplayName("게시판 저장 성공")
    void saveSuccess() {
        Board board = new Board();
        board.setTitle("test");
        board.setCategoryPk(2);

        Map<String, Object> content = new HashMap<>();

        Map<String, Object> content1 = new HashMap<>();
        content1.put("seq", 1);
        content1.put("bg", "#00FFFF");
        content1.put("color", "#FF0000");
        content1.put("code", "00001");
        content1.put("size", "1rem");
        content1.put("value", "example text value");
        content1.put("text", "???");



        Map<String, Object> content2 = new HashMap<>();
        content2.put("seq", 2);
        content2.put("bg", "#FFF00F");
        content2.put("color", "#00FF00");
        content2.put("code", "00002");
        content2.put("size", "1rem");
        content2.put("value", "example text value 123123213");
        content2.put("text", "???");

        List<Map<String, Object>> list = new ArrayList<>();
        list.add(content1);
        list.add(content2);
        list.add(content1);
        list.add(content2);

        content.put("list", list);

        board.setContent(content);

        saveApi(board, false);
    }

    @Test
    @DisplayName("게시판 저장 실패")
    void saveFail() {
        Board board = new Board();
        saveApi(board, true);


        board.setTitle("test");
        saveApi(board, true);


        board.setCategoryPk(2);
        saveApi(board, true);

        Map<String, Object> content = new HashMap<>();
        content.put("string", "test string");
        content.put("int", 1);
        content.put("boolean", true);

        Map<String, Object> content2 = new HashMap<>();
        content2.put("string", "test string2");
        content2.put("int", 2);
        content2.put("boolean", false);

        content.put("map", content2);
        board.setContent(content);

        saveApi(board, false);

    }
    private void saveApi(Board board, boolean isFail) {
        StatusAssertions status =
        webTestClient.post()
                .uri("/api/boards")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(board)
                .exchange()
                .expectStatus();

        WebTestClient.ResponseSpec res = isFail ? status.is5xxServerError() : status.isOk();

        res.expectBody()
            .consumeWith(response -> {
                log.info("response: {}", response);
                assertNotNull(response.getResponseBody());
        });
    }
}