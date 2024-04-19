package com.anamensis.server.controller;

import com.anamensis.server.entity.EmailVerify;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EmailVerifyControllerTest {

    WebTestClient webTestClient;

    @LocalServerPort
    int port;

    Logger log = org.slf4j.LoggerFactory.getLogger(EmailVerifyControllerTest.class);

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:"+ port).build();
    }

    @Test
    void verify() {
        EmailVerify emailVerify = new EmailVerify();
                emailVerify.setEmail("");

        webTestClient.post().uri("/verify/email")
                .bodyValue(emailVerify)
                .header("Content-Type", "application/json")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .consumeWith(response -> {
                    log.info("response: {}", response);
                });
    }

    @Test
    void verifyCode() {
    }
}