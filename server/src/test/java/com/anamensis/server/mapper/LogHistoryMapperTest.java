package com.anamensis.server.mapper;

import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.entity.Member;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrowsExactly;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class LogHistoryMapperTest {

    @SpyBean
    LogHistoryMapper logHistoryMapper;

    @SpyBean
    BCryptPasswordEncoder encoder;

    @SpyBean
    MemberMapper memberMapper;

    Member member1 = new Member();

    LogHistory.LogHistoryBuilder logHistory = LogHistory.builder();

    @BeforeAll
    public void setUp() {
        member1.setUserId("loght1");
        member1.setPwd(encoder.encode("loght1"));
        member1.setName("loght1");
        member1.setEmail("loght1@gmail.com");
        member1.setPhone("010-1111-8001");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);

        logHistory.method("GET");
        logHistory.uri("/api/v1/member");
        logHistory.memberPk(member1.getId());
        logHistory.path("/api/v1/member");
        logHistory.query("userId=loght1");
        logHistory.localAddress("127.0.0.1");
        logHistory.remoteAddress("127.0.0.1");
        logHistory.headers("Content-Type: application/json");
        logHistory.session("123456789");
        logHistory.createAt(LocalDateTime.now());
        logHistoryMapper.save(logHistory.build());
    }

    @Test
    @Order(1)
    @DisplayName("로그를 저장")
    void save() {
        LogHistory.LogHistoryBuilder logHistory = LogHistory.builder();
        logHistory.method("GET");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.uri("/api/v1/member");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.memberPk(member1.getId());
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.path("/api/v1/member");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.query("userId=loght1");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.localAddress("127.0.0.1");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.remoteAddress("127.0.0.1");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.headers("Content-Type: application/json");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.session("1234567890");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.createAt(LocalDateTime.now());
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });
    }

    @Test
    @Order(2)
    @DisplayName("save - method 10자 제한 테스트")
    void method() {
        logHistory.method("a".repeat(10));
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.method("a".repeat(11));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });
        logHistory.method("GET");
    }

    @Test
    @Order(3)
    @DisplayName("save - path 255자 제한 테스트")
    void path() {
        logHistory.path("a".repeat(255));
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.path("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });
        logHistory.path("/api/v1/member");
    }

    @Test
    @Order(4)
    @DisplayName("save - query 500자 제한 테스트")
    void query() {
        logHistory.query("a".repeat(500));
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.query("a".repeat(501));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });
        logHistory.query("userId=loght1");
    }

    @Test
    @Order(5)
    @DisplayName("save - uri 255자 제한 테스트")
    void uri() {
        logHistory.uri("a".repeat(255));
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.uri("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });
        logHistory.uri("/api/v1/member");
    }

    @Test
    @Order(6)
    @DisplayName("save - localAddress 255자 제한 테스트")
    void localAddress() {
        logHistory.localAddress("a".repeat(255));
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.localAddress("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });
        logHistory.localAddress("127.0.0.1");
    }

    @Test
    @Order(7)
    @DisplayName("save - remoteAddress 255자 제한 테스트")
    void remoteAddress() {

        logHistory.remoteAddress("a".repeat(255));
        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.remoteAddress("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            logHistoryMapper.save(logHistory.build());
        });

        logHistory.remoteAddress("127.0.0.1");

        assertDoesNotThrow(() -> {
            logHistoryMapper.save(logHistory.build());
        });
    }
}