package com.anamensis.server.controller;

import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.SystemMessage;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
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
class SystemMessageControllerTest {


    @LocalServerPort
    int port;

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
    @DisplayName("websys code로 system message 전체 조회")
    void findByWebSysPk() {
        wtc.get()
            .uri("/admin/api/sys-message/web-sys/001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(SystemMessage.class)
            .consumeWith(result -> {
                List<SystemMessage> list = result.getResponseBody();
                assertEquals(3, list.size());
                list.stream().reduce((acc, next) -> {
                    assertTrue(acc.getId() < next.getId());
                    return next;
                });
            });

        wtc.get()
            .uri("/admin/api/sys-message/web-sys/002")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(SystemMessage.class)
            .consumeWith(result -> {
                List<SystemMessage> list = result.getResponseBody();

            });

        wtc.get()
            .uri("/admin/api/sys-message/web-sys/999")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(SystemMessage.class)
            .consumeWith(result -> {
                List<SystemMessage> list = result.getResponseBody();
                assertEquals(0, list.size());
                assertTrue(list.isEmpty());
            });
    }

    @Test
    @DisplayName("id로 system message 조회")
    void findById() {
        wtc.get()
            .uri(uriBuilder -> uriBuilder
                .path("/admin/api/sys-message")
                .queryParam("id", 1)
                .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(SystemMessage.class)
            .consumeWith(result -> {
                SystemMessage sm = result.getResponseBody();
                assertNotNull(sm);
                assertEquals(1, sm.getId());
            });

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/admin/api/sys-message")
                    .queryParam("id", 1)
                    .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(SystemMessage.class)
            .consumeWith(result -> {
                SystemMessage sm = result.getResponseBody();
                assertNotNull(sm);
                assertEquals(1, sm.getId());
            });

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                .path("/admin/api/sys-message")
                .queryParam("id", 999)
                .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();
    }

    @Test
    @DisplayName("system message 저장")
    void save() {
        Map<String , Object> body = new HashMap<>();
        body.put("webSysPk", "003");
        body.put("subject", "test subject");
        body.put("content", "test content");

        apiSave200(body, true);

        body.put("content", null);

        apiSave400(body);

        body.put("content", "test content");
        apiSave200(body, true);

        body.put("subject", null);
        apiSave400(body);

        body.put("subject", "a".repeat(256));
        apiSave400(body);

        body.put("subject", "");
        apiSave400(body);

        body.put("subject", "test subject");
        apiSave200(body, true);

        body.put("webSysPk", null);

        apiSave400(body);

        body.put("webSysPk", "004");

        apiSave200(body, true);

        body.put("extra1", "extra1");
        body.put("extra2", "extra2");
        body.put("extra3", "extra3");
        body.put("extra4", "extra4");
        body.put("extra5", "extra5");

        apiSave200(body, true);

    }

    private void apiSave200(Map<String, Object> body, boolean result) {
        wtc.post()
            .uri("/admin/api/sys-message")
            .body(BodyInserters.fromValue(body))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(result);
    }

    private void apiSave400(Map<String, Object> body) {
        wtc.post()
            .uri("/admin/api/sys-message")
            .body(BodyInserters.fromValue(body))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();
    }

    @Test
    @DisplayName("system message 수정")
    void update() {
        SystemMessage sm = findApi(1);

        assertNotNull(sm);

        Map<String, Object> body = new HashMap<>();
        body.put("id", sm.getId());
        body.put("webSysPk", sm.getWebSysPk());
        body.put("subject", sm.getSubject());
        body.put("content", sm.getContent());
        body.put("extra1", sm.getExtra1());
        body.put("extra2", sm.getExtra2());
        body.put("extra3", sm.getExtra3());
        body.put("extra4", sm.getExtra4());
        body.put("extra5", sm.getExtra5());

        apiUpdate200(body, true);
        SystemMessage sm2 = findApi(1);
        assertEquals(body.get("webSysPk"), sm2.getWebSysPk());
        assertEquals(body.get("subject"), sm2.getSubject());
        assertEquals(body.get("content"), sm2.getContent());
        assertEquals(body.get("extra1"), sm2.getExtra1());
        assertEquals(body.get("extra2"), sm2.getExtra2());
        assertEquals(body.get("extra3"), sm2.getExtra3());
        assertEquals(body.get("extra4"), sm2.getExtra4());
        assertEquals(body.get("extra5"), sm2.getExtra5());

        body.put("webSysPk", null);
        apiUpdate400(body);


        body.put("subject", "test subject");
        apiUpdate400(body);
        body.put("webSysPk", "001");
        apiUpdate200(body, true);
        SystemMessage sm4 = findApi(1);
        assertEquals(body.get("subject"), sm4.getSubject());

        body.put("subject", null);
        apiUpdate400(body);

        body.put("subject", "test subject");
        body.put("content", "test content");
        apiUpdate200(body, true);
        SystemMessage sm5 = findApi(1);
        assertEquals(body.get("content"), sm5.getContent());

        body.put("content", null);
        apiUpdate400(body);

        body.put("content", "test content");
        body.put("extra1", "extra1-1");
        body.put("extra2", "extra2-2");
        body.put("extra3", "extra3-3");
        body.put("extra4", "extra4-4");
        body.put("extra5", "extra5-5");
        apiUpdate200(body, true);

        SystemMessage sm6 = findApi(1);
        assertEquals(body.get("extra1"), sm6.getExtra1());
        assertEquals(body.get("extra2"), sm6.getExtra2());
        assertEquals(body.get("extra3"), sm6.getExtra3());
        assertEquals(body.get("extra4"), sm6.getExtra4());
        assertEquals(body.get("extra5"), sm6.getExtra5());


        body.put("webSysPk", "002");
        apiUpdate200(body, false);
    }

    private SystemMessage findApi (int id) {
        return wtc.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/admin/api/sys-message")
                        .queryParam("id", id)
                        .build()
                )
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(SystemMessage.class)
                .returnResult()
                .getResponseBody();
    }

    void apiUpdate400(Map<String, Object> body) {
        wtc.put()
            .uri("/admin/api/sys-message")
            .body(BodyInserters.fromValue(body))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();
    }

    void apiUpdate200(Map<String, Object> body, boolean result) {
        wtc.put()
            .uri("/admin/api/sys-message")
            .body(BodyInserters.fromValue(body))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(result);
    }

    @Test
    @DisplayName("system message 사용여부 수정")
    void updateIsUse() {
        SystemMessage sm = findApi(1);

        assertNotNull(sm);

        Map<String, Object> body = new HashMap<>();
        body.put("id", sm.getId());
        body.put("isUse", !sm.isUse());

        wtc.put()
            .uri("/admin/api/sys-message/is-use")
            .body(BodyInserters.fromValue(body))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        SystemMessage sm2 = findApi(1);
        assertEquals(body.get("isUse"), sm2.isUse());

        body.put("id", 999);
        wtc.put()
            .uri("/admin/api/sys-message/is-use")
            .body(BodyInserters.fromValue(body))
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);
    }

    @Test
    @DisplayName("system message 삭제")
    void delete() {

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                .path("/admin/api/sys-message")
                .queryParam("id", 4)
                .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(SystemMessage.class)
            .consumeWith(result -> {
                SystemMessage sm = result.getResponseBody();
                assertNotNull(sm);
                assertEquals(4, sm.getId());
            });

        wtc.delete()
            .uri(uriBuilder -> uriBuilder
                .path("/admin/api/sys-message")
                .queryParam("id", 4)
                .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(true);

        wtc.get()
            .uri(uriBuilder -> uriBuilder
                .path("/admin/api/sys-message")
                .queryParam("id", 4)
                .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();

        wtc.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/admin/api/sys-message")
                        .queryParam("id", 4)
                        .build()
                )
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(Boolean.class)
                .isEqualTo(false);

        wtc.delete()
            .uri(uriBuilder -> uriBuilder
                .path("/admin/api/sys-message")
                .queryParam("id", 999)
                .build()
            )
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(Boolean.class)
            .isEqualTo(false);

    }
}