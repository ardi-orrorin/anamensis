package com.anamensis.server.controller;

import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class AttendanceControllerTest {

    @LocalServerPort
    int port;

    WebTestClient webTestClient;

    Logger log = org.slf4j.LoggerFactory.getLogger(WebSysControllerTest.class);

    Token token;

    @BeforeEach
    @Order(1)
    void setUp() {
        webTestClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }


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

    @Test
    void update() {
        webTestClient.get()
                .uri("/api/attendance/check")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                })
                .isEqualTo("출석체크 완료");

    }

    @Test
    void info() {
        webTestClient.get()
                .uri("/api/attendance")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });
    }
}