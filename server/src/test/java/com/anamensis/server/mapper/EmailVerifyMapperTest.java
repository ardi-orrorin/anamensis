package com.anamensis.server.mapper;

import com.anamensis.server.entity.EmailVerify;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class EmailVerifyMapperTest {

    @SpyBean
    EmailVerifyMapper evm;

    @Test
    @Order(1)
    @DisplayName("insert 테스트")
    void insert() {
        EmailVerify ev = new EmailVerify();
        ev.setEmail("ev1@gmail.com");
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
            evm.insert(ev)
        );

        ev.setCode("001234");
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                evm.insert(ev)
        );
        ev.setCreateAt(LocalDateTime.now());
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                evm.insert(ev)
        );

        ev.setExpireAt(LocalDateTime.now().plusMinutes(5));
        assertEquals(1, evm.insert(ev));
    }

    @Test
    @Order(2)
    @DisplayName("selectByEmailAndCode 테스트")
    void selectByEmailAndCode() {
        EmailVerify ev = new EmailVerify();
        ev.setEmail("d-member-1@gmail.com");
        ev.setCode("123456");

        // timestamp localdatetime 지역 시간대 문제로 인해 9시간 빼줌
        ev.setExpireAt(LocalDateTime.now().minusHours(9));

        assertTrue(evm.selectByEmailAndCode(ev).isPresent());

        ev.setEmail("d-member-2@gmail.com");
        ev.setCode("011111");
        ev.setExpireAt(LocalDateTime.now().minusHours(9));
        assertFalse(evm.selectByEmailAndCode(ev).isPresent());

        ev.setEmail("d-member-1@gmail.com");
        ev.setCode("003456");
        assertFalse(evm.selectByEmailAndCode(ev).isPresent());
    }

    @Test
    @Order(3)
    @DisplayName("updateIsUse 테스트")
    void updateIsUse() {
        EmailVerify ev = new EmailVerify();
        ev.setEmail("d-member-1@gmail.com");
        ev.setCode("123456");
        ev.setUse(false);
        ev.setExpireAt(LocalDateTime.now().minusHours(9));

        assertTrue(evm.selectByEmailAndCode(ev).isPresent());
        assertEquals(1, evm.updateIsUse(ev));
        assertFalse(evm.selectByEmailAndCode(ev).isPresent());

        ev.setEmail("d-member-2@gmail.com");
        ev.setCode("121212");
        assertEquals(0, evm.updateIsUse(ev));
    }

    @Test
    @Order(4)
    @DisplayName("email 255자 제한 테스트")
    void emailLengthLimit() {
        EmailVerify ev = new EmailVerify();
        ev.setCode("123456");
        ev.setCreateAt(LocalDateTime.now());
        ev.setExpireAt(LocalDateTime.now().plusMinutes(5));

        ev.setEmail("a".repeat(255));
        assertDoesNotThrow(() ->
                evm.insert(ev)
        );

        ev.setEmail("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                evm.insert(ev)
        );
    }

    @Test
    @Order(5)
    @DisplayName("code 6자 제한 테스트")
    void codeLengthLimit() {
        EmailVerify ev = new EmailVerify();
        ev.setEmail("test1@gmail.com");
        ev.setCreateAt(LocalDateTime.now());
        ev.setExpireAt(LocalDateTime.now().plusMinutes(5));

        ev.setCode("a".repeat(6));
        assertDoesNotThrow(() ->
                evm.insert(ev)
        );

        ev.setCode("a".repeat(7));
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                evm.insert(ev)
        );
    }

    @Test
    @Order(6)
    @DisplayName("updateDisableByEmail 테스트")
    void updateDisableByEmail() {
        assertEquals(2, evm.updateDisableByEmail("d-member-1@gmail.com"));
        assertEquals(1, evm.updateDisableByEmail("d-member-2@gmail.com"));
        assertEquals(0, evm.updateDisableByEmail("d-member@gmail.com"));
    }
}