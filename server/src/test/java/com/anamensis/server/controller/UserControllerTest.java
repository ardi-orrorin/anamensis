package com.anamensis.server.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.MultiValueMap;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class UserControllerTest {

    private Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);


    @LocalServerPort
    private int port;


    private WebTestClient webTestClient;


    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:" + port).build();
    }


    @Test
    void login() {

        MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
        formData.add("username", "admin");
        formData.add("password", "admin");

        EntityExchangeResult<String> result =
        webTestClient.post()
                .uri("/login")
                .bodyValue(formData)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();


        log.info(result.getResponseBody());
//                .value(token -> assertTrue(token.startsWith("Bearer ")));
    }

    @Test
    void test() {
        EntityExchangeResult<String> result =
        webTestClient.get()
                .uri("/test")
                .header("Authorization","Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcxMTI3NDUwMn0.njdXymw5_ObMIdoXX8berWpPPANfJtXeb9_ExcOjeMwEnNV0t_bUGAhrdLfHoujoutH7xxBXoBH7O6_oRAPxNQ")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();

        log.info(result.getResponseBody());
    }
}