package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.Member;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class LoginHistoryMapperTest {

    @SpyBean
    LoginHistoryMapper lhMapper;


    @SpyBean
    BCryptPasswordEncoder encoder;

    @SpyBean
    MemberMapper memberMapper;

    Member member1 = new Member();
    Member member2 = new Member();

    LoginHistory.LoginHistoryBuilder loginHistory = LoginHistory.builder();

    @BeforeAll
    public void setUp() {
        member1.setUserId("lhmt1");
        member1.setPwd(encoder.encode("lhmt1"));
        member1.setName("lhmt1");
        member1.setEmail("lhmt1@gmail.com");
        member1.setPhone("010-1111-7001");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);

        member2.setUserId("lhmt2");
        member2.setPwd(encoder.encode("lhmt2"));
        member2.setName("lhmt2");
        member2.setEmail("lhmt2@gmail.com");
        member2.setPhone("010-1111-7002");
        member2.setUse(true);
        member2.setCreateAt(LocalDateTime.now());
        memberMapper.save(member2);

        loginHistory.ip("127.0.0.1");
        loginHistory.device("chrome");
        loginHistory.location("seoul");
        loginHistory.createAt(LocalDateTime.now());
        lhMapper.save(loginHistory.build(), member1);
    }

    @Test
    @Order(1)
    @DisplayName("로그인 기록 저장")
    void save() {
        LoginHistory.LoginHistoryBuilder loginHistory = LoginHistory.builder();
        loginHistory.ip("127.0.0.1");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.device("chrome");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.location("seoul");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.createAt(LocalDateTime.now());
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });
    }

    @Test
    @Order(1)
    @DisplayName("save - ip 255자 제한 테스트")
    void ip() {
        loginHistory.ip("a".repeat(255));
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.ip("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.ip("127.0.0.1");
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });
    }

    @Test
    @Order(1)
    @DisplayName("save - location 255자 제한 테스트")
    void location() {
        loginHistory.location("a".repeat(255));
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.location("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.location("seoul");
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });
    }

    @Test
    @Order(1)
    @DisplayName("save - device 255자 제한 테스트")
    void device() {
        loginHistory.device("a".repeat(255));
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.device("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            lhMapper.save(loginHistory.build(), member1);
        });

        loginHistory.device("chrome");
        assertDoesNotThrow(() -> {
            lhMapper.save(loginHistory.build(), member1);
        });
    }



    @Test
    @Order(2)
    @DisplayName("로그인 기록 갯수 조회")
    void count() {

        Member member3 = new Member();
        member3.setUserId("lhmt3");
        member3.setPwd(encoder.encode("lhmt3"));
        member3.setName("lhmt3");
        member3.setEmail("lhmt3@gmail.com");
        member3.setPhone("010-1111-7003");
        member3.setUse(true);
        member3.setCreateAt(LocalDateTime.now());
        memberMapper.save(member3);


        for (int i = 0; i < 25; i++) {
            LoginHistory lh1 = LoginHistory.builder()
                    .ip("127.0.0.1")
                    .device("chrome")
                    .location("seoul")
                    .createAt(LocalDateTime.now())
                    .build();

            lhMapper.save(lh1, member3);
        }

        assertEquals(25, lhMapper.count(member3.getId()));
        assertTrue(lhMapper.count(member1.getId()) > 0);
        assertEquals(0, lhMapper.count(100));
    }

    @Test
    @Order(3)
    @DisplayName("로그인 기록 조회")
    void selectAll() {
        Member member4 = new Member();
        member4.setUserId("lhmt4");
        member4.setPwd(encoder.encode("lhmt4"));
        member4.setName("lhmt4");
        member4.setEmail("lhmt4@gmail.com");
        member4.setPhone("010-1111-7004");
        member4.setUse(true);
        member4.setCreateAt(LocalDateTime.now());
        memberMapper.save(member4);

        for(int i = 0; i < 8; i++) {
            LoginHistory lh2 = LoginHistory.builder()
                    .ip("127.0.0.1")
                    .device("chrome"+i)
                    .location("seoul"+i)
                    .createAt(LocalDateTime.now())
                    .build();
            lhMapper.save(lh2, member4);
        }

        Page page = new Page();

        page.setPage(1);
        page.setSize(5);
        List<LoginHistory> loginHistories = lhMapper.selectAll(member4, page);

        assertEquals(5, loginHistories.size());

        assertFalse(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome8")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome7")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome6")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome5")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome4")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome3")));

        assertFalse(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul8")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul7")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul6")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul5")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul4")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul3")));

        page.setPage(2);
        page.setSize(5);
        loginHistories = lhMapper.selectAll(member4, page);

        assertEquals(3, loginHistories.size());

        assertFalse(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome3")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome2")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome1")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getDevice().equals("chrome0")));

        assertFalse(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul3")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul2")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul1")));
        assertTrue(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul0")));
        assertFalse(loginHistories.stream().anyMatch(lh -> lh.getLocation().equals("seoul")));

    }


}