package com.anamensis.server.controller;

import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.SystemMessageRequest;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SystemMessageControllerTest {

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
    void findByWebSysPk() {
        webTestClient.get()
                .uri("/admin/api/sys-message/web-sys/011")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info(new String(response.getResponseBody()));
                });
    }

    @Test
    void findById() {
        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/admin/api/sys-message")
                        .queryParam("id", 3)
                        .build())
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info(new String(response.getResponseBody()));
                });
    }

    @Test
    void save() {

        SystemMessageRequest.Body sm = new SystemMessageRequest.Body();
        sm.setWebSysPk("014");
        sm.setContent("test content");
        sm.setSubject("test subject");
        sm.setExtra5("test extra5");



        webTestClient.post()
                .uri("/admin/api/sys-message")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sm)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info(new String(response.getResponseBody()));
                });
    }

    @Test
    void update() {
        SystemMessageRequest.Body sm = new SystemMessageRequest.Body();
        sm.setId(5);
        sm.setContent("test content testtest");
        sm.setSubject("test subject testsetset");
        sm.setExtra5("test extra5 testset");

        webTestClient.put()
                .uri("/admin/api/sys-message")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sm)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info(new String(response.getResponseBody()));
                });
    }

    @Test
    void updateIsUse() {
        SystemMessageRequest.isUse isUse = new SystemMessageRequest.isUse();
        isUse.setId(5);
        isUse.setUse(false);

        webTestClient.put()
                .uri("/admin/api/sys-message/is-use")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(isUse)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(response -> {
                    log.info(new String(response.getResponseBody()));
                });
    }
}