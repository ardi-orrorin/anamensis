package com.anamensis.server.controller;

import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserConfigSmtpRequest;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.UserConfigSmtp;
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

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class UserConfigSmtpControllerTest {
    @LocalServerPort
    int port;

    WebTestClient webTestClient;

    Token token;

    @BeforeEach
    @Order(1)
    void setUp() {
        webTestClient = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @BeforeEach
    @Order(2)
    void setToken() {
        UserRequest.Login login = new UserRequest.Login();
        login.setUsername("admin");
        login.setPassword("admin");

        EntityExchangeResult<UserResponse.Login> result =
                webTestClient.post()
                        .uri("/user/login")
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
                .accessToken(Objects.requireNonNull(result.getResponseBody()).getAccessToken())
                .refreshToken(result.getResponseBody().getRefreshToken())
                .build();
    }

    Logger log = org.slf4j.LoggerFactory.getLogger(ShareLinkControllerTest.class);


    @Test
    void list() {
        webTestClient.get()
                .uri("/user-config-smtp")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info("response: {}", response);
                });
    }

    @Test
    void get() {
        webTestClient.get()
                .uri("/user-config-smtp/1")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info("response: {}", response);
                });
    }

    @Test
    void save() {

        UserConfigSmtpRequest.UserConfigSmtp stmp = new UserConfigSmtpRequest.UserConfigSmtp();
        stmp.setHost("smtp.gmail.com");
        stmp.setPort("233");
        stmp.setUsername("fdf");
        stmp.setPassword("fdf");
        stmp.setFromEmail("fdf");
        stmp.setFromName("fdf");
        stmp.setUseSSL(true);
        webTestClient.post()
                .uri("/user-config-smtp")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(stmp)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info("response: {}", response);
                });
    }

    @Test
    void update() {
        UserConfigSmtp stmp = new UserConfigSmtp();
//        stmp.setId(3); // 다른 사용자 stmp
        stmp.setId(2);
        stmp.setUsername("fdf");
        stmp.setHost("smtp.gmail.com");
        stmp.setFromName("fdsdsf");
        stmp.setUseSSL(false);

        webTestClient.put()
            .uri("/user-config-smtp")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token.getAccessToken());
            })
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(stmp)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .consumeWith(response -> {
                log.info("response: {}", response);
            });
    }
}