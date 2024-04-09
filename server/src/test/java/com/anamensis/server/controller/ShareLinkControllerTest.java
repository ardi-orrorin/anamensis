package com.anamensis.server.controller;

import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.ShareLinkRequest;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.ShareLinkResponse;
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

import java.util.Objects;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class ShareLinkControllerTest {

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
    void redirect() {
        EntityExchangeResult<ShareLinkResponse.Redirect> result =
        webTestClient.get()
                .uri("/link/{shareLink}", "bdeDDMOGTiBpnOg")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ShareLinkResponse.Redirect.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());
    }

    @Test
    void insert() {
        ShareLinkRequest.Param param = new ShareLinkRequest.Param();
        param.setLink("/test/test/test/test");

        EntityExchangeResult result =
        webTestClient.post()
                .uri("/link")
//                .header("Authorization", "Bearer " + token.getRefreshToken())
                .header("Authorization", "Bearer" + token.getRefreshToken())
                .bodyValue(param)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .returnResult();

        log.info("result: {}", result);
    }

    @Test
    void updateUse() {

        ShareLinkRequest.Use use = new ShareLinkRequest.Use();
        use.setId(22);
        use.setUse(false);

        EntityExchangeResult result =
        webTestClient.put()
                .uri("/link")
                .header("Authorization", "Bearer " + token)
                .bodyValue(use)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .returnResult();

        log.info("result: {}", result);
    }

    @Test
    void testPage() {
        EntityExchangeResult<String> result =
        webTestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/link")
                        .queryParam("page", 4)
                        .queryParam("limit", 10)
                        .queryParam("criteria", "id")
                        .queryParam("sort", "asc")
                        .queryParam("test", "te2323st")
                        .build()
                )
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());
    }

    @Test
    void list() {
        EntityExchangeResult<String> result =
        webTestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/link")
                        .queryParam("page", 3)
                        .queryParam("size", 2)
                        .queryParam("criteria", "createAt")
                        .queryParam("order", "asc")
                        .queryParam("link", "test")
                        .build()
                )
                .header("Authorization", "Bearer " + token)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());
    }
}