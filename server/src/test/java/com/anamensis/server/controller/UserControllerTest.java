package com.anamensis.server.controller;

import com.anamensis.server.dto.PageResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.provider.TokenProvider;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.StatusAssertions;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserControllerTest {

    @LocalServerPort
    int port;

    @SpyBean
    TokenProvider tokenProvider;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);

    WebTestClient wtc;

    String token = "";

    String token2 = "";

    @BeforeEach
    @Order(1)
    void setUp() {
        wtc = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();

        Map<String, String> map = new HashMap<>();
        map.put("username", "d-member-1");
        map.put("password", "d-member-1");
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

        Map<String, String> map2 = new HashMap<>();
        map2.put("username", "d-member-2");
        map2.put("password", "d-member-2");
        map2.put("authType", "email");
        map2.put("code", "0");
        wtc.post()
                .uri("/public/api/user/verify")
                .body(BodyInserters.fromValue(map2))
                .headers(httpHeaders -> {
                    httpHeaders.set("Device", "chrome");
                    httpHeaders.set("Location", "seoul");
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserResponse.Login.class)
                .consumeWith(result ->
                        token2 = Objects.requireNonNull(result.getResponseBody()).getAccessToken()
                );
    }

    @Test
    @DisplayName("로그인 테스트")
    void login() {
         WebTestClient.ResponseSpec req1 =  wtc.post()
                .uri("/public/api/user/login")
                .body(BodyInserters.fromValue("{\"username\":\"d-member-1\",\"password\":\"d-member-1\"}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .exchange();

        req1.expectStatus().isOk()
            .expectBody()
            .jsonPath("$.authType").isEqualTo("NONE")
            .jsonPath("$.verity").isEqualTo(false);

        WebTestClient.ResponseSpec req2 =  wtc.post()
                .uri("/public/api/user/login")
                .body(BodyInserters.fromValue("{\"username\":\"d-member-2\",\"password\":\"d-member-2\"}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .exchange();

        WebTestClient.ResponseSpec req3 =  wtc.post()
                .uri("/public/api/user/login")
                .body(BodyInserters.fromValue("{\"username\":\"d-member-4\",\"password\":\"d-member-4\"}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .exchange();

        req2.expectStatus().isOk()
            .expectBody()
            .jsonPath("$.authType").isEqualTo("OTP")
            .jsonPath("$.verity").isEqualTo(false);


        wtc.post()
                .uri("/public/api/user/login")
                .body(BodyInserters.fromValue("{\"username\":\"d-member-1\",\"password\":\"d-member-6\"}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .exchange().expectStatus().is4xxClientError();

        wtc.post()
                .uri("/public/api/user/login")
                .body(BodyInserters.fromValue("{\"username\":\"\",\"password\":\"d-member-6\"}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .exchange().expectStatus().is4xxClientError();

        wtc.post()
                .uri("/public/api/user/login")
                .body(BodyInserters.fromValue("{\"username\":\"d-member-6\",\"password\":\"\"}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .exchange().expectStatus().is4xxClientError();

    }

    @Test
    @DisplayName("2차 인증 테스트")
    @Transactional
    void verify() {
        WebTestClient.ResponseSpec req1 =  wtc.post()
                .uri("/public/api/user/verify")
                .body(BodyInserters.fromValue("{\"username\":\"d-member-3\",\"password\":\"d-member-3\",\"authType\":\"NONE\",\"code\":0}"))
                .header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .headers(httpHeaders -> {
                    httpHeaders.set("Device", "chrome");
                    httpHeaders.set("Location", "seoul");
                })
                .exchange();

        req1.expectStatus().isOk()
                .expectBody()
                .jsonPath("$.accessToken").exists()
                .jsonPath("$.accessTokenExpiresIn").isEqualTo(tokenProvider.ACCESS_EXP)
                .jsonPath("$.refreshToken").exists()
                .jsonPath("$.refreshTokenExpiresIn").isEqualTo(tokenProvider.REFRESH_EXP)
                .jsonPath("$.username").isEqualTo("d-member-3")
                .jsonPath("$.roles").value(roles -> {
                    assertTrue(roles instanceof List);
                    assertEquals(1, ((List) roles).size());
                });
    }

    @Test
    @DisplayName("회원가입 테스트")
    @Transactional
    void signup() {
        Map<String, String> map = new HashMap<>();

        map.put("id", "d-member-6");

        this.res(map).is4xxClientError();

        map.put("pwd", "d-member-6");

        this.res(map).is4xxClientError();


        map.put("name", "d-member-6");

        this.res(map).is4xxClientError();

        map.put("email", "d-member-6@gmail.com");

        this.res(map).is4xxClientError();

        map.put("phone", "010-1234-5678");

        this.res(map).isOk();
        this.res(map).is4xxClientError();

        map.put("id", "d-member-7");
        map.put("email", "d-member-7@gmail.com");
        map.put("phone", "01012345678");
        this.res(map).isOk();

        map.put("phone", "010-124-5678");
        this.res(map).isBadRequest();

        map.put("id", "d-member-8");
        map.put("email", "d-member-8@gmail.com");

        map.put("phone", "10-1424-5678");
        this.res(map).isOk();

        map.put("phone", "010-1424-5678");
        this.res(map).isBadRequest();


        map.put("id", "d-member-9");
        map.put("phone", "010-2424-5678");

        map.put("email", "d-member-8gmail.com");
        this.res(map).is4xxClientError();

        map.put("email", "d-member-8@gmailcom");
        this.res(map).is4xxClientError();

        map.put("email", "d-member-8@gmai!l.com");
        this.res(map).is4xxClientError();

        map.put("email", "d-member-9@gmail.com");
        this.res(map).isOk();

        map.put("id", "d-member-10");
        map.put("phone", "010-2424-7679");
        map.put("email", "d-member-10@gmail.com");

        map.put("name", "a".repeat(101));
        this.res(map).is4xxClientError();


        map.put("name", "a".repeat(100));
        this.res(map).isOk();

        map.put("id", "d-member-11");
        map.put("phone", "010-2424-7779");
        map.put("email", "d-member-11@gmail.com");

        map.put("pwd", "a".repeat(7));
        this.res(map).is4xxClientError();

        map.put("pwd", "a".repeat(256));
        this.res(map).is4xxClientError();

        map.put("pwd", "a".repeat(8));
        this.res(map).isOk();

        map.put("id", "d-member-12");
        map.put("phone", "010-2424-7879");
        map.put("email", "d-member-12@gmail.com");
        map.put("pwd", "a".repeat(255));
        this.res(map).isOk();

        map.put("phone", "010-2425-7879");
        map.put("email", "d-member-13@gmail.com");

        map.put("id", "a".repeat(4));
        this.res(map).is4xxClientError();

        map.put("id", "a".repeat(51));
        this.res(map).is4xxClientError();

        map.put("id", "a".repeat(5));
        this.res(map).isOk();

        map.put("phone", "010-2426-7879");
        map.put("email", "d-member-14@gmail.com");

        map.put("id", "a".repeat(50));
        this.res(map).isOk();

    }

    StatusAssertions res(Map<String, String> map) {
        return wtc.post()
                .uri("/public/api/user/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(map))
                .exchange().expectStatus();
    }

    @Test
    @DisplayName("계정 중복 확인 테스트")
    void exists() {
        Map<String, String> map = new HashMap<>();
        map.put("type", "id");
        map.put("value", "d-member-1");

        this.existsApi(map, HttpStatus.OK, "true");

        map.put("value", "d-member-10");
        this.existsApi(map, HttpStatus.OK, "false");

        map.put("type", "email");
        map.put("value", "d-member-1@gmail.com");

        this.existsApi(map, HttpStatus.OK, "true");
        map.put("value", "d-member-10@gmail.com");
        this.existsApi(map, HttpStatus.OK, "false");

        map.put("type", "phone");
        map.put("value", "010-0000-0001");

        this.existsApi(map, HttpStatus.OK, "true");

        map.put("value", "010-1234-0001");
        this.existsApi(map, HttpStatus.OK, "false");

    }

    void existsApi(Map<String, String> map ,HttpStatus status, String message) {
        wtc.post()
                .uri("/public/api/user/exists")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(map))
                .exchange().expectStatus().isOk()
                .expectBody(UserResponse.Status.class)
                .consumeWith(result -> {
                    assertEquals(status, result.getResponseBody().getStatus());
                    assertEquals(message, result.getResponseBody().getMessage());
                });
    }

    @Test
    @DisplayName("로그인 내역 조회 테스트")
    void histories() {
        wtc.get()
            .uri(uriBuilder -> {
                uriBuilder.path("/api/user/histories");
                uriBuilder.queryParam("page", 1);
                uriBuilder.queryParam("size", 10);
                return uriBuilder.build();
            })
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(PageResponse.class)
            .consumeWith(result -> {
                if(result.getResponseBody() == null) return;
                assertTrue(result.getResponseBody().page().getTotal() > 4);
                List loginHistory = result.getResponseBody().content();
                assertTrue(loginHistory.size() > 4);

                assertTrue(result.getResponseBody().page().getTotal() >= loginHistory.size());
            });
    }

    @Test
    void refresh() {
    }

    @Test
    @DisplayName("프로필 사진 조회 테스트")
    void profileImg() {
        wtc.get()
            .uri("/api/user/profile-img")
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody().consumeWith(result -> {
                assertNull(result.getResponseBody());
            });
    }

    @Test
    @DisplayName("회원 정보 테스트")
    void info() {
        wtc.get()
            .uri("/api/user/info")
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token2))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.MyPage.class)
            .consumeWith(result -> {
                assertEquals("d-member-2", result.getResponseBody().getUserId());
                assertEquals("d-member-2@gmail.com", result.getResponseBody().getEmail());
                assertEquals("010-0000-0002", result.getResponseBody().getPhone());
            });
    }

    @Test
    @DisplayName("회원 정보 수정 테스트")
    void update() {
        Map<String, String> map = new HashMap<>();
        map.put("name", "d-member-11212");

        wtc.put()
            .uri("/api/user/info")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.Status.class)
            .consumeWith(result -> {
                assertEquals(HttpStatus.OK, result.getResponseBody().getStatus());
                assertEquals("Success", result.getResponseBody().getMessage());

            });

        wtc.get()
            .uri("/api/user/info")
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.MyPage.class)
            .consumeWith(result -> {
                assertEquals("d-member-11212", result.getResponseBody().getName());
            });

        map.clear();
        map.put("email", "d-member-11212@gmail.com");

        wtc.put()
                .uri("/api/user/info")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(map))
                .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserResponse.Status.class)
                .consumeWith(result -> {
                    assertEquals(HttpStatus.OK, result.getResponseBody().getStatus());
                    assertEquals("Success", result.getResponseBody().getMessage());
                });

        wtc.get()
                .uri("/api/user/info")
                .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserResponse.MyPage.class)
                .consumeWith(result -> {
                    assertEquals("d-member-11212@gmail.com", result.getResponseBody().getEmail());
                });

        map.clear();
        map.put("phone", "010-2222-3333");

        wtc.put()
            .uri("/api/user/info")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.Status.class)
            .consumeWith(result -> {
                assertEquals(HttpStatus.OK, result.getResponseBody().getStatus());
                assertEquals("Success", result.getResponseBody().getMessage());
            });

        wtc.get()
            .uri("/api/user/info")
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.MyPage.class)
            .consumeWith(result -> {
                assertEquals("010-2222-3333", result.getResponseBody().getPhone());
            });

        map.clear();
        map.put("phone", "010-0000-0002");

        wtc.put()
                .uri("/api/user/info")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(map))
                .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserResponse.Status.class)
                .consumeWith(result -> {
                    assertEquals(HttpStatus.BAD_REQUEST, result.getResponseBody().getStatus());
                    assertEquals("Failed", result.getResponseBody().getMessage());
                });

    }

    @Test
    @DisplayName("2차 인증 수정 테스트")
    void sAuth() {
        Map<String, Object> map = new HashMap<>();
        map.put("sauthType", "EMAIL");
        map.put("sauth", true);

        wtc.put()
            .uri("/api/user/s-auth")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.Status.class)
            .consumeWith(result -> {
                assertEquals(HttpStatus.OK, result.getResponseBody().getStatus());
                assertEquals("Success", result.getResponseBody().getMessage());
            });

        map.clear();

        map.put("sauthType", "OTP");
        map.put("sauth", true);

        wtc.put()
            .uri("/api/user/s-auth")
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(map))
            .headers(httpHeaders -> httpHeaders.setBearerAuth(token))
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.Status.class)
            .consumeWith(result -> {
                assertEquals(HttpStatus.OK, result.getResponseBody().getStatus());
                assertEquals("Success", result.getResponseBody().getMessage());
            });

    }


}