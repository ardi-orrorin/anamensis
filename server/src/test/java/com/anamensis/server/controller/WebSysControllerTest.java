package com.anamensis.server.controller;

import com.anamensis.server.dto.StatusType;
import com.anamensis.server.dto.request.WebSysRequest;
import com.anamensis.server.dto.response.StatusResponse;
import com.anamensis.server.dto.response.UserResponse;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class WebSysControllerTest {

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
    @DisplayName("시스템 코드로 조회 테스트")
    void findByCode() {
        wtc.get()
            .uri("/admin/api/web-sys/code?code=003")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys = result.getResponseBody();
                    assertNotNull(webSys);
                    assertEquals("003", webSys.getCode());
                    assertEquals("테스트3", webSys.getName());
                    assertEquals("설명3", webSys.getDescription());
                    assertEquals("MASTER", webSys.getPermission().name());
                });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=999")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();
    }

    @Test
    @DisplayName("시스템 등록 테스트")
    void save() {
        WebSysRequest.WebSysReq webSys = new WebSysRequest.WebSysReq();
        webSys.setCode("015");
        webSys.setName("테스트15");
        webSys.setDescription("설명15");
        webSys.setPermission("USER");

        wtc.post()
            .uri("/admin/api/web-sys")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(webSys))
            .exchange()
            .expectStatus().isOk();

        wtc.get()
            .uri("/admin/api/web-sys/code?code=015")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys2 = result.getResponseBody();
                    assertNotNull(webSys2);
                    assertEquals("015", webSys2.getCode());
                    assertEquals("테스트15", webSys2.getName());
                    assertEquals("설명15", webSys2.getDescription());
                    assertEquals("USER", webSys2.getPermission().name());
                });
    }

    @Test
    @DisplayName("시스템 여러개 한 번에 등록 테스트")
    void saveAll() {
        List<WebSys> list = IntStream.range(7, 10).mapToObj(i -> new WebSys(){{
            setCode("00" + i);
            setName("테스트" + i);
            setDescription("설명" + i);
            setPermission(RoleType.values()[(int) (Math.random() * RoleType.values().length)]);
        }}).collect(Collectors.toList());

        WebSysRequest.WebSysList req = new WebSysRequest.WebSysList();
        req.setList(list);

        wtc.post()
            .uri("/admin/api/web-sys/list")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(req))
            .exchange()
            .expectStatus().isOk();

        wtc.get()
            .uri("/admin/api/web-sys/code?code=007")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys = result.getResponseBody();
                    assertNotNull(webSys);
                    assertEquals("007", webSys.getCode());
                    assertEquals("테스트7", webSys.getName());
                    assertEquals("설명7", webSys.getDescription());
                    assertNotNull(webSys.getPermission());
                });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=008")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys = result.getResponseBody();
                    assertNotNull(webSys);
                    assertEquals("008", webSys.getCode());
                    assertEquals("테스트8", webSys.getName());
                    assertEquals("설명8", webSys.getDescription());
                    assertNotNull(webSys.getPermission());
                });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=009")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys = result.getResponseBody();
                    assertNotNull(webSys);
                    assertEquals("009", webSys.getCode());
                    assertEquals("테스트9", webSys.getName());
                    assertEquals("설명9", webSys.getDescription());
                    assertNotNull(webSys.getPermission());
                });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=010")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();
    }

    @Test
    @DisplayName("시스템 수정 테스트")
    void update() {
        AtomicReference<WebSys> webSys = new AtomicReference<>();

        wtc.get()
            .uri("/admin/api/web-sys/code?code=001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                webSys.set(result.getResponseBody());
                assertNotNull(webSys);
                assertEquals("001", webSys.get().getCode());
                assertEquals("테스트1", webSys.get().getName());
                assertEquals("설명1", webSys.get().getDescription());
                assertEquals("ADMIN", webSys.get().getPermission().name());
            });

        webSys.get().setName("테스트1-1");

        wtc.put()
            .uri("/admin/api/web-sys")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(webSys.get()))
            .exchange()
            .expectBody(StatusResponse.class)
            .consumeWith(result -> {
                StatusResponse statusResponse = result.getResponseBody();
                assertNotNull(statusResponse);
                assertEquals(StatusType.SUCCESS, statusResponse.getStatus());
            });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                WebSys webSys2 = result.getResponseBody();
                assertNotNull(webSys2);
                assertEquals("001", webSys2.getCode());
                assertEquals("테스트1-1", webSys2.getName());
                assertEquals("설명1", webSys2.getDescription());
                assertEquals("ADMIN", webSys2.getPermission().name());
            });

        webSys.get().setDescription("설명1-1");

        wtc.put()
            .uri("/admin/api/web-sys")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(webSys.get()))
            .exchange()
            .expectBody(StatusResponse.class)
            .consumeWith(result -> {
                StatusResponse statusResponse = result.getResponseBody();
                assertNotNull(statusResponse);
                assertEquals(StatusType.SUCCESS, statusResponse.getStatus());
            });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                WebSys webSys2 = result.getResponseBody();
                assertNotNull(webSys2);
                assertEquals("001", webSys2.getCode());
                assertEquals("테스트1-1", webSys2.getName());
                assertEquals("설명1-1", webSys2.getDescription());
                assertEquals("ADMIN", webSys2.getPermission().name());
            });

        webSys.get().setPermission(RoleType.USER);

        wtc.put()
            .uri("/admin/api/web-sys")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(webSys.get()))
            .exchange()
            .expectStatus().isOk();


        wtc.get()
                .uri("/admin/api/web-sys/code?code=001")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys2 = result.getResponseBody();
                    assertNotNull(webSys2);
                    assertEquals("001", webSys2.getCode());
                    assertEquals("테스트1-1", webSys2.getName());
                    assertEquals("설명1-1", webSys2.getDescription());
                    assertEquals("USER", webSys2.getPermission().name());
                });

        webSys.get().setName(null);

        wtc.put()
            .uri("/admin/api/web-sys")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(webSys.get()))
            .exchange()
            .expectBody(StatusResponse.class)
            .consumeWith(result -> {
                StatusResponse statusResponse = result.getResponseBody();
                assertNotNull(statusResponse);
                assertEquals(StatusType.SUCCESS, statusResponse.getStatus());
            });


        wtc.get()
                .uri("/admin/api/web-sys/code?code=001")
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(token);
                })
                .exchange()
                .expectStatus().isOk()
                .expectBody(WebSys.class)
                .consumeWith(result -> {
                    WebSys webSys2 = result.getResponseBody();
                    assertNotNull(webSys2);
                    assertEquals("001", webSys2.getCode());
                    assertEquals("테스트1-1", webSys2.getName());
                    assertEquals("설명1-1", webSys2.getDescription());
                    assertEquals("USER", webSys2.getPermission().name());
                });

        webSys.get().setDescription(null);
        wtc.put()
            .uri("/admin/api/web-sys")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .body(BodyInserters.fromValue(webSys.get()))
            .exchange()
            .expectBody(StatusResponse.class)
            .consumeWith(result -> {
                StatusResponse statusResponse = result.getResponseBody();
                assertNotNull(statusResponse);
                assertEquals(StatusType.SUCCESS, statusResponse.getStatus());
            });


        wtc.get()
            .uri("/admin/api/web-sys/code?code=001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                WebSys webSys2 = result.getResponseBody();
                assertNotNull(webSys2);
                assertEquals("001", webSys2.getCode());
                assertEquals("테스트1-1", webSys2.getName());
                assertEquals("설명1-1", webSys2.getDescription());
                assertEquals("USER", webSys2.getPermission().name());
            });
    }

    @Test
    @DisplayName("시스템 삭제 테스트")
    void deleteByCode() {
        wtc.get()
            .uri("/admin/api/web-sys/code?code=004")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                WebSys webSys = result.getResponseBody();
                assertNotNull(webSys);
                assertEquals("004", webSys.getCode());
            });

        wtc.delete()
            .uri("/admin/api/web-sys/code/004")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectBody(StatusResponse.class)
            .consumeWith(result -> {
                StatusResponse statusResponse = result.getResponseBody();
                assertNotNull(statusResponse);
                assertEquals(StatusType.SUCCESS, statusResponse.getStatus());
            });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=004")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().is4xxClientError();


        wtc.get()
            .uri("/admin/api/web-sys/code?code=001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                WebSys webSys = result.getResponseBody();
                assertNotNull(webSys);
                assertEquals("001", webSys.getCode());
            });

        wtc.delete()
            .uri("/admin/api/web-sys/code/001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token2);
            })
            .exchange()
            .expectBody(StatusResponse.class)
            .consumeWith(result -> {
                StatusResponse statusResponse = result.getResponseBody();
                assertNotNull(statusResponse);
                assertEquals(StatusType.FAIL, statusResponse.getStatus());
            });

        wtc.get()
            .uri("/admin/api/web-sys/code?code=001")
            .headers(httpHeaders -> {
                httpHeaders.setBearerAuth(token);
            })
            .exchange()
            .expectStatus().isOk()
            .expectBody(WebSys.class)
            .consumeWith(result -> {
                WebSys webSys = result.getResponseBody();
                assertNotNull(webSys);
                assertEquals("001", webSys.getCode());
            });
    }
}