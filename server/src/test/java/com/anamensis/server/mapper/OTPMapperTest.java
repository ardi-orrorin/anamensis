package com.anamensis.server.mapper;

import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.OTP;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class OTPMapperTest {

    @SpyBean
    OTPMapper otpMapper;

    @SpyBean
    MemberMapper memberMapper;

    @SpyBean
    BCryptPasswordEncoder encoder;

    Logger log = org.slf4j.LoggerFactory.getLogger(MemberMapperTest.class);
    Member member = new Member();

    OTP otp = new OTP();

    @BeforeAll
    void setUp() {
        member.setUserId("otpmt1");
        member.setPwd(encoder.encode("otpmt1"));
        member.setName("otpmt1");
        member.setEmail("otpmt1@gmail.com");
        member.setPhone("010-1111-6001");
        member.setUse(true);
        member.setCreateAt(LocalDateTime.now());
        memberMapper.save(member);

        otp.setMemberPk(member.getId());
        otp.setHash("hash");
        otp.setCreateAt(LocalDateTime.now());
        otpMapper.insert(otp);
    }

    @Test
    @Order(1)
    @DisplayName("insert OTP")
    void insert() {
        Member member1 = memberMapper.findMemberByUserId("otpmt1").get();

        OTP otp = new OTP();

        otp.setMemberPk(member1.getId());
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
            otpMapper.insert(otp)
        );

        otp.setHash("hash12");
        assertThrowsExactly(DataIntegrityViolationException.class, () ->
                otpMapper.insert(otp)
        );

        otp.setCreateAt(LocalDateTime.now());
        assertDoesNotThrow(() -> otpMapper.insert(otp));

        assertNotNull(otp.getId());

        // rollback
        otpMapper.updateIsUse(otp);
    }

    @Test
    @Order(2)
    @DisplayName("OTP 존재 여부 확인")
    void existByMemberPk() {
        assertTrue(otpMapper.existByMemberPk(member.getId()));
        assertFalse(otpMapper.existByMemberPk(99));
    }

    @Test
    @Order(3)
    @DisplayName("유저 아이디로 OTP 조회")
    void selectByUserId() {
        assertFalse(otpMapper.selectByUserId("test").isPresent());
        assertThrowsExactly(NoSuchElementException.class, () ->
                otpMapper.selectByUserId("test").get()
        );

        assertTrue(otpMapper.selectByUserId("otpmt1").isPresent());
        assertDoesNotThrow(() -> otpMapper.selectByUserId("otpmt1").get());

        OTP otp = otpMapper.selectByUserId("otpmt1").get().getOtp();
        assertNotNull(otp.getHash());
        assertEquals("hash", otp.getHash());
    }

    @Test
    @Order(4)
    @DisplayName("Member Id OTP 조회")
    void selectByMemberPk() {
        assertFalse(otpMapper.selectByMemberPk(99).isPresent());
        assertThrowsExactly(NoSuchElementException.class, () ->
                otpMapper.selectByMemberPk(99).get()
        );

        assertTrue(otpMapper.selectByMemberPk(member.getId()).isPresent());
        assertDoesNotThrow(() -> otpMapper.selectByMemberPk(member.getId()).get());


        OTP otp1 = otpMapper.selectByMemberPk(member.getId()).get();
        assertNotNull(otp1.getHash());
        assertEquals(otp.getHash(), otp1.getHash());
        assertEquals(otp.getCreateAt(), otp1.getCreateAt());
        assertEquals(otp.getMemberPk(), otp1.getMemberPk());
    }

    @Test
    @Order(5)
    @DisplayName("OTP 업데이트")
    void update() {
        Member member1 = new Member();
        member1.setUserId("otpmt2");
        member1.setPwd(encoder.encode("otpmt2"));
        member1.setName("otpmt2");
        member1.setEmail("otpmt2@gmail.com");
        member1.setPhone("010-1111-6002");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);

        OTP otp1 = new OTP();
        otp1.setMemberPk(member1.getId());
        otp1.setHash("hash-2");
        otp1.setCreateAt(LocalDateTime.now());
        otpMapper.insert(otp1);


        otp1.setUse(false);
        otp1.setHash("hash-test");
        assertEquals(0, otpMapper.updateIsUse(otp1));

        otp1.setHash("hash-2");
        assertEquals(1, otpMapper.updateIsUse(otp1));
    }

    @Test
    @Order(6)
    @DisplayName("OTP 비활성화")
    void disableOTP() {
        assertEquals(0, otpMapper.disableOTP(100));
        assertTrue(otpMapper.existByMemberPk(member.getId()));
        assertTrue(otpMapper.disableOTP(member.getId()) > 0);
        assertFalse(otpMapper.existByMemberPk(member.getId()));
    }

    @Test
    @Order(7)
    @DisplayName("save - hash 255자 제한 테스트")
    void hash() {
        otp.setHash("a".repeat(255));
        assertDoesNotThrow(() -> {
            otpMapper.insert(otp);
        });

        otp.setHash("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            otpMapper.insert(otp);
        });

        otp.setHash("hash10000");
        assertDoesNotThrow(() -> {
            otpMapper.insert(otp);
        });
    }



}