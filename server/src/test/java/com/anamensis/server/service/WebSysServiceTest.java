package com.anamensis.server.service;

import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class WebSysServiceTest {

    @SpyBean
    WebSysService wss;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("시스템 메시지 코드 전체 조회")
    void findAll() {
        StepVerifier.create(wss.findAll())
                .expectNextCount(1)
                .verifyComplete();

        StepVerifier.create(wss.findAll())
                .assertNext(webSys -> {
                    assertEquals(4, webSys.size());
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("001")));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("002")));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("003")));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("004")));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getPermission() == RoleType.ADMIN));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getPermission() == RoleType.USER));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getPermission() == RoleType.MASTER));
                    assertFalse(webSys.stream().anyMatch(sys -> sys.getPermission() == RoleType.GUEST));
                })
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("시스템 메시지 코드로 조회")
    void findByCode() {
        StepVerifier.create(wss.findByCode("001"))
                .assertNext(webSys -> {
                    assertEquals("001", webSys.getCode());
                    assertEquals("테스트1", webSys.getName());
                    assertEquals(RoleType.ADMIN, webSys.getPermission());
                })
                .verifyComplete();

        StepVerifier.create(wss.findByCode("002"))
                .assertNext(webSys -> {
                    assertEquals("002", webSys.getCode());
                    assertEquals("테스트2", webSys.getName());
                    assertEquals(RoleType.USER, webSys.getPermission());
                })
                .verifyComplete();

        StepVerifier.create(wss.findByCode("003"))
                .assertNext(webSys -> {
                    assertEquals("003", webSys.getCode());
                    assertEquals("테스트3", webSys.getName());
                    assertEquals(RoleType.MASTER, webSys.getPermission());
                })
                .verifyComplete();

        StepVerifier.create(wss.findByCode("004"))
                .assertNext(webSys -> {
                    assertEquals("004", webSys.getCode());
                    assertEquals("테스트4", webSys.getName());
                    assertEquals(RoleType.ADMIN, webSys.getPermission());
                })
                .verifyComplete();

    }

    @Test
    @Order(3)
    @DisplayName("권한으로 조회")
    void findByPermission() {
        StepVerifier.create(wss.findByPermission(RoleType.ADMIN))
                .assertNext(webSys -> {
                    assertEquals(2, webSys.size());
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("001")));
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("004")));

                    webSys.stream().reduce((acc, next) -> {
                        assertTrue(acc.getCode().compareTo(next.getCode()) < 0);
                        return next;
                    });

                })
                .verifyComplete();

        StepVerifier.create(wss.findByPermission(RoleType.USER))
                .assertNext(webSys -> {
                    assertEquals(1, webSys.size());
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("002")));
                })
                .verifyComplete();

        StepVerifier.create(wss.findByPermission(RoleType.MASTER))
                .assertNext(webSys -> {
                    assertEquals(1, webSys.size());
                    assertTrue(webSys.stream().anyMatch(sys -> sys.getCode().equals("003")));
                })
                .verifyComplete();

        StepVerifier.create(wss.findByPermission(RoleType.GUEST))
                .assertNext(webSys -> {
                    assertEquals(0, webSys.size());
                })
                .verifyComplete();
    }

    @Test
    @Order(4)
    @DisplayName("시스템 메시지 코드 저장")
    void save() {

        WebSys webSys = new WebSys();
        webSys.setCode("005");
        StepVerifier.create(wss.save(webSys))
                .verifyErrorMessage("Invalid WebSys");

        webSys.setCode(null);
        webSys.setName("테스트5");
        StepVerifier.create(wss.save(webSys))
                .verifyErrorMessage("Invalid WebSys");

        webSys.setName(null);
        webSys.setPermission(RoleType.ADMIN);
        StepVerifier.create(wss.save(webSys))
                .verifyErrorMessage("Invalid WebSys");


        webSys.setCode("005");
        webSys.setName("테스트5");
        webSys.setPermission(RoleType.ADMIN);

        StepVerifier.create(wss.save(webSys))
                .verifyComplete();

        StepVerifier.create(wss.findByCode("005"))
                .assertNext(sys -> {
                    assertEquals("005", sys.getCode());
                    assertEquals("테스트5", sys.getName());
                    assertEquals(RoleType.ADMIN, sys.getPermission());
                })
                .verifyComplete();
    }

    @Test
    @Order(5)
    @DisplayName("시스템 메시지 코드 전체 저장")
    void saveAll() {
        List<WebSys> webSysList = IntStream.range(6, 10).parallel().mapToObj(i ->
            new WebSys() {{
                setCode("00" + i);
                setName("테스트" + i);
                setPermission(RoleType.values()[(int) (Math.random() * RoleType.values().length)]);
            }}
        ).collect(Collectors.toList());

        StepVerifier.create(wss.saveAll(webSysList))
                .verifyComplete();

        StepVerifier.create(wss.findAll())
                .assertNext(sys -> {
                    assertEquals(8, sys.size());
                    assertTrue(sys.stream().anyMatch(s -> s.getCode().equals("006")));
                    assertTrue(sys.stream().anyMatch(s -> s.getCode().equals("007")));
                    assertTrue(sys.stream().anyMatch(s -> s.getCode().equals("008")));
                    assertTrue(sys.stream().anyMatch(s -> s.getCode().equals("009")));
                })
                .verifyComplete();
    }

    @Test
    @Order(6)
    @DisplayName("시스템 메시지 코드 수정")
    void update() {
        StepVerifier.create(wss.findByCode("001"))
                .assertNext(sys -> {
                    sys.setName(null);
                    StepVerifier.create(wss.update(sys))
                            .expectNext(true)
                            .verifyComplete();
                    sys.setName("테스트1-1");


                    sys.setPermission(null);
                    StepVerifier.create(wss.update(sys))
                            .expectNext(true)
                            .verifyComplete();

                    sys.setPermission(RoleType.USER);
                    StepVerifier.create(wss.update(sys))
                            .expectNext(true)
                            .verifyComplete();
                })
                .verifyComplete();

        StepVerifier.create(wss.findByCode("001"))
                .assertNext(sys -> {
                    assertEquals("테스트1-1", sys.getName());
                    assertEquals(RoleType.USER, sys.getPermission());
                })
                .verifyComplete();
    }

    @Test
    @Order(7)
    @DisplayName("시스템 메시지 코드 삭제")
    void deleteByCode() {
        StepVerifier.create(wss.findByCode("004"))
                .assertNext(sys -> {
                    assertEquals("004", sys.getCode());
                })
                .verifyComplete();

        StepVerifier.create(wss.deleteByCode("004"))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(wss.findByCode("004"))
                .verifyErrorMessage("webSys not found");
    }
}