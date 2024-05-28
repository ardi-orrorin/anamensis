package com.anamensis.server.mapper;

import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.MemberConfigSmtp;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MemberConfigSmtpMapperTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(MemberConfigSmtpMapperTest.class);

    @SpyBean
    MemberConfigSmtpMapper userConfigSmtpMapper;

    @SpyBean
    BCryptPasswordEncoder encoder;

    @SpyBean
    MemberMapper memberMapper;

    MemberConfigSmtp userConfigSmtp = new MemberConfigSmtp();

    @BeforeAll
    public void setUp() {
        Member member1 = new Member();
        Member member2 = new Member();
        member1.setUserId("ucsm1");
        member1.setPwd(encoder.encode("ucsm1"));
        member1.setName("ucsm1");
        member1.setEmail("ucsm1@gmail.com");
        member1.setPhone("010-1111-3001");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);

        member2.setUserId("ucsm2");
        member2.setPwd(encoder.encode("ucsm2"));
        member2.setName("ucsm2");
        member2.setEmail("ucsm2@gmail.com");
        member2.setPhone("010-1111-3002");
        member2.setUse(true);
        member2.setCreateAt(LocalDateTime.now());
        memberMapper.save(member2);


        memberMapper.findMemberByUserId("ucsm1")
                .ifPresent(member -> userConfigSmtp.setMemberPk(member.getId()));
        userConfigSmtp.setHost("smtp.test.com");
        userConfigSmtp.setPort("576");
        userConfigSmtp.setUsername("username");
        userConfigSmtp.setPassword("password");
        userConfigSmtp.setFromEmail("fromEmail");
        userConfigSmtp.setFromName("fromName");
        userConfigSmtp.setUseSSL(true);
        userConfigSmtp.setIsDefault(true);

        userConfigSmtpMapper.save(userConfigSmtp);
    }

    @Test
    @Order(1)
    @DisplayName("저장")
    void save() {
        MemberConfigSmtp userConfigSmtp = new MemberConfigSmtp();
        memberMapper.findMemberByUserId("ucsm2")
                .ifPresent(member -> userConfigSmtp.setMemberPk(member.getId()));

        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtp.setHost("smtp.gmail.com");
            userConfigSmtpMapper.save(userConfigSmtp);
        });

        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtp.setPort("03939");
            userConfigSmtpMapper.save(userConfigSmtp);
        });

        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtp.setUsername("username");
            userConfigSmtpMapper.save(userConfigSmtp);
        });


        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtp.setPassword("password");
            userConfigSmtpMapper.save(userConfigSmtp);
        });

        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtp.setFromEmail("fromEmail");
            userConfigSmtpMapper.save(userConfigSmtp);
        });

        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtp.setFromName("fromName");
            userConfigSmtpMapper.save(userConfigSmtp);
        });

        userConfigSmtp.setUseSSL(true);
        assertThrowsExactly(DataIntegrityViolationException.class, ()-> {
            userConfigSmtpMapper.save(userConfigSmtp);
        });

        assertDoesNotThrow(()-> {
            userConfigSmtp.setIsDefault(true);
            userConfigSmtpMapper.save(userConfigSmtp);
        });
    }



    @Test
    @Order(2)
    @DisplayName("저장 무결성 검사")
    @Disabled("무결성 검사 불필요")
    void saveIntegrity() {
        // given
        MemberConfigSmtp userConfigSmtp = new MemberConfigSmtp();
        memberMapper.findMemberByUserId("ucsm1")
                .ifPresent(member -> userConfigSmtp.setMemberPk(member.getId()));
        userConfigSmtp.setHost("smtp.naver.com");
        userConfigSmtp.setPort("03939");
        userConfigSmtp.setUsername("username");
        userConfigSmtp.setPassword("password");
        userConfigSmtp.setFromEmail("fromEmail");
        userConfigSmtp.setFromName("fromName");
        userConfigSmtp.setUseSSL(true);
        userConfigSmtp.setIsDefault(true);

        userConfigSmtpMapper.save(userConfigSmtp);

        userConfigSmtpMapper.disabled(userConfigSmtp.getId(), userConfigSmtp.getMemberPk());

        // when
        userConfigSmtpMapper.save(userConfigSmtp);
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp1.setPort("0939");
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp1.setUsername("username1");
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp1.setPassword("password1");
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp1.setFromEmail("fromEmail1");
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp1.setFromName("fromName1");
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp.setUseSSL(false);
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
//
//        assertThrowsExactly(DuplicateKeyException.class, ()-> {
//            userConfigSmtp1.setIsDefault(false);
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });

//        assertDoesNotThrow(()-> {
//            userConfigSmtp.setIsUse(true);
//            userConfigSmtpMapper.save(userConfigSmtp);
//        });
    }



    @Test
    @Order(3)
    @DisplayName("id로 조회")
    void selectById() {

        MemberConfigSmtp userConfigSmtp1 = userConfigSmtpMapper.selectById(userConfigSmtp.getId()).get();
        assertEquals(userConfigSmtp.getId(), userConfigSmtp1.getId());
        assertEquals(userConfigSmtp.getHost(), userConfigSmtp1.getHost());
        assertEquals(userConfigSmtp.getPort(), userConfigSmtp1.getPort());
        assertEquals(userConfigSmtp.getUsername(), userConfigSmtp1.getUsername());
        assertEquals(userConfigSmtp.getPassword(), userConfigSmtp1.getPassword());
        assertEquals(userConfigSmtp.getFromEmail(), userConfigSmtp1.getFromEmail());
        assertEquals(userConfigSmtp.getFromName(), userConfigSmtp1.getFromName());
        assertEquals(userConfigSmtp.getUseSSL(), userConfigSmtp1.getUseSSL());
        assertEquals(userConfigSmtp.getIsDefault(), userConfigSmtp1.getIsDefault());
        assertEquals(userConfigSmtp.getMemberPk(), userConfigSmtp1.getMemberPk());
        assertNull(userConfigSmtp.getIsUse());
        assertTrue(userConfigSmtp1.getIsUse());



        MemberConfigSmtp userConfigSmtp2 = new MemberConfigSmtp();
        memberMapper.findMemberByUserId("ucsm1")
                .ifPresent(member -> userConfigSmtp2.setMemberPk(member.getId()));
        userConfigSmtp2.setHost("smtp.naver.com");
        userConfigSmtp2.setPort("03939");
        userConfigSmtp2.setUsername("username");
        userConfigSmtp2.setPassword("password");
        userConfigSmtp2.setFromEmail("fromEmail");
        userConfigSmtp2.setFromName("fromName");
        userConfigSmtp2.setUseSSL(true);
        userConfigSmtp2.setIsDefault(true);
        userConfigSmtpMapper.save(userConfigSmtp2);

        assertTrue(userConfigSmtpMapper.selectById(userConfigSmtp.getId()).isPresent());
        assertDoesNotThrow(()->{
            userConfigSmtpMapper.selectById(userConfigSmtp.getId()).get();
        });

        userConfigSmtpMapper.disabled(userConfigSmtp2.getId(), userConfigSmtp2.getMemberPk());

        assertFalse(userConfigSmtpMapper.selectById(userConfigSmtp2.getId()).isPresent());
        assertTrue(userConfigSmtpMapper.selectById(userConfigSmtp2.getId()).isEmpty());

        assertThrowsExactly(NoSuchElementException.class, ()->{
            userConfigSmtpMapper.selectById(userConfigSmtp2.getId()).get();
        });

        assertThrowsExactly(NoSuchElementException.class, ()->{
            userConfigSmtpMapper.selectById(1000).get();
        });
    }


    @Test
    @Order(4)
    @DisplayName("수정")
    void update() {
        MemberConfigSmtp userConfigSmtp = new MemberConfigSmtp();
        memberMapper.findMemberByUserId("ucsm1")
                .ifPresent(member -> userConfigSmtp.setMemberPk(member.getId()));
        userConfigSmtp.setHost("smtp.naver.com");
        userConfigSmtp.setPort("03939");
        userConfigSmtp.setUsername("username");
        userConfigSmtp.setPassword("password");
        userConfigSmtp.setFromEmail("fromEmail");
        userConfigSmtp.setFromName("fromName");
        userConfigSmtp.setUseSSL(true);
        userConfigSmtp.setIsDefault(true);
        userConfigSmtpMapper.save(userConfigSmtp);


        userConfigSmtp.setHost("smtp.daum.net");
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getHost(), userConfigSmtp1.getHost())
                );

        userConfigSmtp.setPort("1234");
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getPort(), userConfigSmtp1.getPort())
                );

        userConfigSmtp.setUsername("username1");
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getUsername(), userConfigSmtp1.getUsername())
                );

        userConfigSmtp.setPassword("password1");
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getPassword(), userConfigSmtp1.getPassword())
                );

        userConfigSmtp.setFromEmail("fromEmail1");
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getFromEmail(), userConfigSmtp1.getFromEmail())
                );

        userConfigSmtp.setFromName("fromName1");
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getFromName(), userConfigSmtp1.getFromName())
                );

        userConfigSmtp.setUseSSL(false);
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getUseSSL(), userConfigSmtp1.getUseSSL())
                );

        userConfigSmtp.setIsDefault(false);
        userConfigSmtpMapper.update(userConfigSmtp);
        userConfigSmtpMapper.selectById(userConfigSmtp.getId())
                .ifPresent(userConfigSmtp1 ->
                        assertEquals(userConfigSmtp.getIsDefault(), userConfigSmtp1.getIsDefault())
                );


        userConfigSmtp.setIsUse(false);
        userConfigSmtpMapper.update(userConfigSmtp);

        assertTrue(userConfigSmtpMapper.selectById(userConfigSmtp.getId()).isEmpty());
        assertThrowsExactly(NoSuchElementException.class, ()->{
            userConfigSmtpMapper.selectById(userConfigSmtp.getId()).get();
        });
    }


    @Test
    @Order(5)
    @DisplayName("회원별 조회")
    void selectByMemberPk() {
        MemberConfigSmtp userConfigSmtp1 = new MemberConfigSmtp();
        Member member = memberMapper.findMemberByUserId("ucsm1").get();

        userConfigSmtp1.setMemberPk(member.getId());
        userConfigSmtp1.setHost("smtp.naver.com");
        userConfigSmtp1.setPort("03939");
        userConfigSmtp1.setUsername("username");
        userConfigSmtp1.setPassword("password");
        userConfigSmtp1.setFromEmail("fromEmail");
        userConfigSmtp1.setFromName("fromName");
        userConfigSmtp1.setUseSSL(true);
        userConfigSmtp1.setIsDefault(true);
        userConfigSmtpMapper.save(userConfigSmtp1);

        List<MemberConfigSmtp> list = userConfigSmtpMapper.selectByMemberPk(member.getId());
        assertTrue(list.size() >= 2);
        assertTrue(list.stream().anyMatch(userConfigSmtp2 -> userConfigSmtp2.getId() == userConfigSmtp.getId()));
        assertTrue(list.stream().anyMatch(userConfigSmtp2 -> userConfigSmtp2.getId() == userConfigSmtp1.getId()));

        userConfigSmtpMapper.disabled(userConfigSmtp1.getId(), userConfigSmtp1.getMemberPk());
        List<MemberConfigSmtp> list1 = userConfigSmtpMapper.selectByMemberPk(member.getId());
        assertTrue(list1.size() >= 1);

        assertTrue(list1.stream().anyMatch(userConfigSmtp2 -> userConfigSmtp2.getId() == userConfigSmtp.getId()));
        assertFalse(list1.stream().anyMatch(userConfigSmtp2 -> userConfigSmtp2.getId() == userConfigSmtp1.getId()));

        List<MemberConfigSmtp> list3 = userConfigSmtpMapper.selectByMemberPk(999);
        assertTrue(list3.isEmpty());
    }

    @Test
    @Order(6)
    void disabled() {
        MemberConfigSmtp userConfigSmtp1 = new MemberConfigSmtp();
        Member member = memberMapper.findMemberByUserId("ucsm1").get();

        userConfigSmtp1.setMemberPk(member.getId());
        userConfigSmtp1.setHost("smtp.naver.com");
        userConfigSmtp1.setPort("03939");
        userConfigSmtp1.setUsername("username");
        userConfigSmtp1.setPassword("password");
        userConfigSmtp1.setFromEmail("fromEmail");
        userConfigSmtp1.setFromName("fromName");
        userConfigSmtp1.setUseSSL(true);
        userConfigSmtp1.setIsDefault(true);
        userConfigSmtpMapper.save(userConfigSmtp1);

        userConfigSmtpMapper.disabled(userConfigSmtp1.getId(), userConfigSmtp1.getMemberPk());
        assertFalse(userConfigSmtpMapper.selectById(userConfigSmtp1.getId()).isPresent());
        assertTrue(userConfigSmtpMapper.selectById(userConfigSmtp1.getId()).isEmpty());

        assertThrowsExactly(NoSuchElementException.class, ()->{
            userConfigSmtpMapper.selectById(userConfigSmtp1.getId()).get();
        });
    }



    @Test
    @Order(7)
    @DisplayName("회원의 첫번째 id 조회")
    void selectFirstId() {
        MemberConfigSmtp userConfigSmtp1 = new MemberConfigSmtp();
        Member member = memberMapper.findMemberByUserId("ucsm1").get();

        userConfigSmtp1.setMemberPk(member.getId());
        userConfigSmtp1.setHost("smtp.naver.com");
        userConfigSmtp1.setPort("03939");
        userConfigSmtp1.setUsername("username");
        userConfigSmtp1.setPassword("password");
        userConfigSmtp1.setFromEmail("fromEmail");
        userConfigSmtp1.setFromName("fromName");
        userConfigSmtp1.setUseSSL(true);
        userConfigSmtp1.setIsDefault(true);
        userConfigSmtpMapper.save(userConfigSmtp1);

        assertTrue(userConfigSmtpMapper.selectFirstId(member.getId()).isPresent());
        assertDoesNotThrow(()->{
            userConfigSmtpMapper.selectFirstId(member.getId()).get();
        });

        MemberConfigSmtp userConfigSmtp2 = userConfigSmtpMapper.selectFirstId(member.getId()).get();

        assertNotEquals(userConfigSmtp1.getId(), userConfigSmtp2.getId());

        assertEquals(userConfigSmtp1.getMemberPk(), userConfigSmtp2.getMemberPk());

        assertEquals(userConfigSmtp.getId(), userConfigSmtp2.getId());
    }


    @Test
    @Order(8)
    @DisplayName("회원의 기본값 모두 비활성")
    void updateDefault() {
        MemberConfigSmtp userConfigSmtp1 = new MemberConfigSmtp();
        Member member = memberMapper.findMemberByUserId("ucsm1").get();

        userConfigSmtp1.setMemberPk(member.getId());
        userConfigSmtp1.setHost("smtp.naver.com");
        userConfigSmtp1.setPort("03939");
        userConfigSmtp1.setUsername("username");
        userConfigSmtp1.setPassword("password");
        userConfigSmtp1.setFromEmail("fromEmail");
        userConfigSmtp1.setFromName("fromName");
        userConfigSmtp1.setUseSSL(true);
        userConfigSmtp1.setIsDefault(true);
        userConfigSmtpMapper.save(userConfigSmtp1);

        userConfigSmtpMapper.disabledDefaults(member.getId());

        List<MemberConfigSmtp> list = userConfigSmtpMapper.selectByMemberPk(member.getId());
        list.forEach(userConfigSmtp2 -> assertFalse(userConfigSmtp2.getIsDefault()));

        list.forEach(userConfigSmtp2 -> {
            userConfigSmtp2.setIsDefault(true);
            userConfigSmtpMapper.update(userConfigSmtp2);
        });

        list.forEach(userConfigSmtp2 -> assertTrue(userConfigSmtp2.getIsDefault()));
    }

}