package com.anamensis.server.controller;

import com.anamensis.server.dto.Token;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.request.WebSysRequest;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WebSysControllerTest {

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
    void findAll() {
        webTestClient.get()
                .uri("/admin/web-sys")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(WebSys.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });
    }

    @Test
    void findByCode() {
        webTestClient.get()
                .uri("/admin/web-sys/code?code=010")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(WebSys.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });
    }

    @Test
    void save() {

        WebSys webSys = new WebSys();
        webSys.setCode("014");
        webSys.setName("Test");
        webSys.setDescription("Test Description");
        webSys.setPermission(RoleType.ADMIN);

        webTestClient.post()
                .uri("/admin/web-sys")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(webSys)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Void.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });
    }

    @Test
    void saveAll() {
        List<WebSys> list = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            WebSys webSys = new WebSys();
            webSys.setCode("11" + i);
            webSys.setName("Test" + i);
            webSys.setDescription("Test Description" + i);
            webSys.setPermission(RoleType.ADMIN);
            list.add(webSys);
        }
        WebSysRequest.WebSysList list1 = new WebSysRequest.WebSysList();
        list1.setList(list);

        webTestClient.post()
                .uri("/admin/web-sys/list")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(list1)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Void.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });
    }

    @Test
    void update() {

        WebSys webSys = new WebSys();
        webSys.setCode("011");
        webSys.setName("Test Update");
        webSys.setDescription("Test Description Update");
        webSys.setPermission(RoleType.ADMIN);

        webTestClient.put()
                .uri("/admin/web-sys")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(webSys)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Void.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });

    }

    @Test
    void deleteByCode() {

        webTestClient.delete()
                .uri("/api/web-sys/code/012")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token.getAccessToken());
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(Void.class)
                .consumeWith(response -> {
                    log.info("Response: {}", response);
                });
    }
}