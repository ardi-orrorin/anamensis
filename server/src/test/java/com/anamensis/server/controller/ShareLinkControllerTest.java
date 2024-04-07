package com.anamensis.server.controller;

import com.anamensis.server.dto.request.ShareLinkRequest;
import com.anamensis.server.dto.response.ShareLinkResponse;
import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.reactive.server.WebTestClientConfigurer;
import org.springframework.util.MultiValueMap;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.springSecurity;
import static org.springframework.web.reactive.function.client.ExchangeFilterFunctions.basicAuthentication;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ShareLinkControllerTest {

    @LocalServerPort
    int port;

    WebTestClient webTestClient;

    String token;

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
        MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
        formData.add("username", "admin");
        formData.add("password", "admin");

        EntityExchangeResult<UserResponse.Login> result =
                webTestClient.post()
                        .uri("/login")
                        .bodyValue(formData)
                        .exchange()
                        .expectStatus().isOk()
                        .expectBody(UserResponse.Login.class)
                        .returnResult();

        token = Objects.requireNonNull(result.getResponseBody()).getToken();
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

        log.info("token: {}", token);
        ShareLinkRequest.Param param = new ShareLinkRequest.Param();
        param.setLink("/test/test/test/test");

        EntityExchangeResult result =
        webTestClient.post()
                .uri("/link")
                .header("Authorization", "Bearer " + token)
                .bodyValue(param)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .returnResult();

        log.info("result: {}", result);
    }

    @Test
    void updateUse() {
    }
}