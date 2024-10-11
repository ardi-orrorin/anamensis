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
            .baseUrl("https://localhost:" + port)
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create().secure(sslContextSpec -> sslContextSpec.sslContext(
                    SslContextBuilder.forClient().trustManager(InsecureTrustManagerFactory.INSTANCE)
                ))
            ))
            .build();
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
}