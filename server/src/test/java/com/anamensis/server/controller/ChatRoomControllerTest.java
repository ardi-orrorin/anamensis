package com.anamensis.server.controller;

import com.anamensis.server.dto.response.ChatRoomResponse;
import com.anamensis.server.dto.response.UserResponse;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;
import reactor.netty.http.client.HttpClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ChatRoomControllerTest {

    @LocalServerPort
    int port;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);

    WebTestClient wtc;

    String token = "";

    @BeforeEach
    @Order(1)
    void setUp() {
        wtc = WebTestClient
            .bindToServer()
            .baseUrl("http://localhost:" + port)
            .build();

        Map<String, String> map = new HashMap<>();
        map.put("username", "admin1");
        map.put("password", "adminAdmin1");
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
    }

    @Test
    void selectAllByUsername() {
    }

    @Test
    void selectById() {
        wtc.get()
            .uri("/api/chat-room/2")
            .exchange()
            .expectStatus().isOk()
            .expectBody(ChatRoomResponse.Detail.class)
            .consumeWith(result -> {
                log.info("result: {}", result);
            });

    }

    @Test
    void save() {
    }

    @Test
    void selectByPartner() {
        wtc.get()
            .uri("/api/chat-rooms/partner/d-member-2")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Long.class)
            .consumeWith(result -> {
                log.info("result: {}", result);
            });
    }
}