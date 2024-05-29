package com.anamensis.server.mapper;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.resultMap.MemberResultMap;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class MemberMapperTest {

    @SpyBean
    MemberMapper memberMapper;

    @SpyBean
    BCryptPasswordEncoder encoder;

    Logger log = org.slf4j.LoggerFactory.getLogger(MemberMapperTest.class);
    Member member1 = new Member();
    Member member2 = new Member();
    Member member100 = new Member();

    Role role2 = new Role();

    @BeforeAll
    void setup() {
        member1.setUserId("admin1");
        member1.setPwd(encoder.encode("admin1"));
        member1.setName("admin1");
        member1.setEmail("admin1@gmail.com");
        member1.setPhone("010-1111-1111");
        member1.setUse(true);
        member1.setCreateAt(LocalDateTime.now());
        memberMapper.save(member1);

        member2.setUserId("admin2");
        member2.setPwd(encoder.encode("admin2"));
        member2.setName("admin2");
        member2.setEmail("admin2@gmail.com");
        member2.setPhone("010-1111-2222");
        member2.setUse(true);
        member2.setCreateAt(LocalDateTime.now());
        memberMapper.save(member2);

        role2.setMemberPk(member2.getId());
        role2.setRole(RoleType.ADMIN);
        memberMapper.saveRole(role2);

        role2.setMemberPk(member2.getId());
        role2.setRole(RoleType.USER);
        memberMapper.saveRole(role2);

        member100.setUserId("admin100");
        member100.setPwd(encoder.encode("admin100"));
        member100.setName("admin100");
        member100.setEmail("admin100@gmail.com");
        member100.setPhone("010-1111-1222");
        member100.setUse(true);
        member100.setCreateAt(LocalDateTime.now());
        memberMapper.save(member100);
    }

    @Test
    @DisplayName("모든 유저 조회")
    @Order(1)
    void findAllUsers() {
        List<Member> member = memberMapper.findAllMember();
        assertTrue(member.size() > 0);

        // not null
        member.forEach(m -> {
            assertNotEquals(0, m.getId());
            assertNotNull(m.getUserId());
            assertNotNull(m.getName());
            assertNotNull(m.getEmail());
            assertNotNull(m.getPhone());
            assertNotNull(m.getCreateAt());
        });

        member.stream().filter(m -> m.getUserId().equals("admin1"))
                .findFirst()
                .ifPresentOrElse(m -> {
                    assertEquals("admin1", m.getUserId());
                    assertEquals("admin1", m.getName());
                    assertEquals("admin1@gmail.com", m.getEmail());
                    assertEquals("010-1111-1111", m.getPhone());
                    assertTrue(m.isUse());
                }, () -> fail("user not found"));

        member.stream().filter(m -> m.getUserId().equals("admin2"))
                .findFirst()
                .ifPresentOrElse(m -> {
                    assertEquals("admin2", m.getUserId());
                    assertEquals("admin2", m.getName());
                    assertEquals("admin2@gmail.com", m.getEmail());
                    assertEquals("010-1111-2222", m.getPhone());
                    assertTrue(m.isUse());
                }, () -> fail("user not found"));
    }

    @Test
    @DisplayName("유저 아이디로 조회")
    @Order(2)
    void findUserByUserId() {

        assertTrue(memberMapper.findMemberByUserId("admin").isEmpty());
        assertThrowsExactly(NoSuchElementException.class, () -> memberMapper.findMemberByUserId("admin3").get());

        assertTrue(memberMapper.findMemberByUserId("admin1").isPresent());
        assertNotNull(memberMapper.findMemberByUserId("admin1").get());

        memberMapper.findMemberByUserId("admin1")
                .ifPresentOrElse(m -> {
                    assertEquals("admin1", m.getUserId());
                    assertEquals("admin1", m.getName());
                    assertEquals("admin1@gmail.com", m.getEmail());
                    assertEquals("010-1111-1111", m.getPhone());
                    assertTrue(m.isUse());
                    log.info("{}", m);
                }, () -> fail("user not found"));

    }

    @Test
    @DisplayName("유저 저장")
    @Order(3)
    @Transactional
    void save() {
        Member member = new Member();
        String pwd = encoder.encode("admin3");

        member.setUserId("admin3");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> memberMapper.save(member));

        member.setPwd(pwd);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> memberMapper.save(member));

        member.setName("admin3");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> memberMapper.save(member));

        member.setEmail("admin3@gmail.com");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> memberMapper.save(member));

        member.setPhone("010-1111-3333");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> memberMapper.save(member));

        member.setCreateAt(LocalDateTime.now());
        member.setUse(true);

        assertDoesNotThrow(() -> memberMapper.save(member));

        // 무결성 테스트
        assertThrowsExactly(DuplicateKeyException.class, () -> memberMapper.save(member));

        member.setUserId("admin4");
        assertThrowsExactly(DuplicateKeyException.class, () -> memberMapper.save(member));

        member.setPwd(encoder.encode("admin3"));
        assertThrowsExactly(DuplicateKeyException.class, () -> memberMapper.save(member));

        member.setEmail("admin4@gmail.com");
        assertThrowsExactly(DuplicateKeyException.class, () -> memberMapper.save(member));

        member.setPhone("010-1111-4444");
        memberMapper.save(member);
    }

    @Test
    @DisplayName("유저 정보 조회")
    @Order(4)
    void findMemberInfo() {
        // 없는 유저
        assertTrue(memberMapper.findMemberInfo("admin").isEmpty());
        assertThrowsExactly(NoSuchElementException.class, () -> memberMapper.findMemberInfo("admin").get());

        // role 이 없는 경우
        assertFalse(memberMapper.findMemberInfo("admin1").isPresent());
        assertThrowsExactly(NoSuchElementException.class, () -> memberMapper.findMemberInfo("admin1").get());

        // role 이 있는 경우
        assertTrue(memberMapper.findMemberInfo("admin2").isPresent());
        assertNotNull(memberMapper.findMemberInfo("admin2").get());

        MemberResultMap memberResultMap = memberMapper.findMemberInfo("admin2").get();
        assertNotNull(memberResultMap.getMember());
        assertNotNull(memberResultMap.getRoles());
        assertEquals(2, memberResultMap.getRoles().size());


        memberResultMap.getRoles().forEach(role -> {
            assertNotEquals(0, role.getMemberPk());
            assertNotNull(role.getRole());
        });

        Member member = memberResultMap.getMember();
        assertEquals("admin2", member.getUserId());
        assertEquals("admin2", member.getName());
        assertEquals("admin2@gmail.com", member.getEmail());
        assertEquals("010-1111-2222", member.getPhone());
        assertTrue(member.isUse());

    }

    @Test
    @DisplayName("권한 저장")
    @Order(5)
    void saveRole() {
        Member member1 = memberMapper.findMemberByUserId("admin1").get();
        Member member2 = memberMapper.findMemberByUserId("admin2").get();

        Role role1 = new Role();
        role1.setMemberPk(member1.getId());
        role1.setRole(RoleType.ADMIN);
        assertDoesNotThrow(() -> memberMapper.saveRole(role1));

        Role role2 = new Role();
        role2.setMemberPk(member2.getId());
        role2.setRole(RoleType.ADMIN);
        assertThrows(DuplicateKeyException.class ,() -> memberMapper.saveRole(role2));

        role2.setRole(RoleType.MASTER);
        assertDoesNotThrow(() -> memberMapper.saveRole(role2));
    }

    @Test
    @DisplayName("권한 삭제")
    @Order(6)
    void deleteRole() {

        Role role1 = memberMapper.findMemberInfo("admin2").get().getRoles().get(0);
        Role role2 = memberMapper.findMemberInfo("admin2").get().getRoles().get(1);

        assertDoesNotThrow(() -> memberMapper.deleteRole(role1));

        assertEquals(0, memberMapper.deleteRole(role1));

        assertDoesNotThrow(() -> memberMapper.deleteRole(role2));
    }

    @Test
    @DisplayName("유저 존재 여부")
    @Order(7)
    void existsUser() {
        UserRequest.existsMember existsMember = new UserRequest.existsMember();
        existsMember.setType("id");
        existsMember.setValue("admin");

        assertFalse(memberMapper.existsMember(existsMember));
        existsMember.setValue("admin1");
        assertTrue(memberMapper.existsMember(existsMember));

        existsMember.setType("email");
        assertFalse(memberMapper.existsMember(existsMember));

        existsMember.setValue("admin1@gmail.com");
        assertTrue(memberMapper.existsMember(existsMember));

        existsMember.setValue("admin1@naver.com");
        assertFalse(memberMapper.existsMember(existsMember));

        existsMember.setType("phone");
        assertFalse(memberMapper.existsMember(existsMember));

        existsMember.setValue("010-2222-1111");
        assertFalse(memberMapper.existsMember(existsMember));

        existsMember.setValue("010-1111-1111");
        assertTrue(memberMapper.existsMember(existsMember));
    }

    @Test
    @DisplayName("2차 인증 수정")
    @Order(8)
    void editAuth() {
        Member member = memberMapper.findMemberByUserId("admin1").get();

        assertDoesNotThrow(() -> memberMapper.editAuth(member.getId(), false, AuthType.NONE));

        assertDoesNotThrow(() -> memberMapper.editAuth(member.getId(), true, AuthType.OTP));

        assertEquals(AuthType.OTP, memberMapper.findMemberByUserId("admin1").get().getSAuthType());
        assertTrue(memberMapper.findMemberByUserId("admin1").get().getSAuth());

    }

    @Test
    @DisplayName("포인트 수정")
    @Order(9)
    void updatePoint() {
        Member member = memberMapper.findMemberByUserId("admin1").get();

        assertDoesNotThrow(() -> memberMapper.updatePoint(member.getId(), 100));
        assertEquals(100, memberMapper.findMemberByUserId("admin1").get().getPoint());

        assertDoesNotThrow(() -> memberMapper.updatePoint(member.getId(), 200));
        assertEquals(300, memberMapper.findMemberByUserId("admin1").get().getPoint());

        assertDoesNotThrow(() -> memberMapper.updatePoint(member.getId(), -50));
        assertEquals(250, memberMapper.findMemberByUserId("admin1").get().getPoint());
    }

    @Test
    @Order(10)
    @DisplayName("userId 50자 제한 테스트")
    void userId() {
        member100.setUserId("a".repeat(50));
        assertDoesNotThrow(() -> {
            member100.setPwd(encoder.encode("admin101"));
            member100.setName("admin101");
            member100.setEmail("admin101@gmail.com");
            member100.setPhone("010-1111-1223");
            memberMapper.save(member100);
        });

        member100.setUserId("a".repeat(51));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            memberMapper.save(member100);
        });

        member100.setUserId("admin100");
    }

    @Test
    @Order(11)
    @DisplayName("pwd 255자 제한 테스트")
    void pwd() {
        member100.setPwd("a".repeat(255));
        assertDoesNotThrow(() -> {
            member100.setUserId("admin102");
            member100.setName("admin102");
            member100.setEmail("admin102@gmail.com");
            member100.setPhone("010-1111-1224");
            memberMapper.save(member100);
        });

        member100.setPwd("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            member100.setUserId("admin103");
            member100.setName("admin103");
            member100.setEmail("admin103@gmail.com");
            member100.setPhone("010-1111-1225");
            memberMapper.save(member100);
        });

        member100.setPwd(encoder.encode("admin100"));
    }

    @Test
    @Order(12)
    @DisplayName("name 100자 제한 테스트")
    void name() {
        member100.setName("a".repeat(100));
        assertDoesNotThrow(() -> {
            member100.setUserId("admin104");
            member100.setPwd(encoder.encode("admin104"));
            member100.setEmail("admin104@gmail.com");
            member100.setPhone("010-1111-1226");
            memberMapper.save(member100);
        });

        member100.setName("a".repeat(101));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            member100.setUserId("admin105");
            member100.setPwd(encoder.encode("admin105"));
            member100.setEmail("admin105@gmail.com");
            member100.setPhone("010-1111-1227");
            memberMapper.save(member100);
        });

        member100.setName("admin100");
    }

    @Test
    @Order(13)
    @DisplayName("email 255자 제한 테스트")
    void email() {
        member100.setEmail("a".repeat(255));
        assertDoesNotThrow(() -> {
            member100.setUserId("admin106");
            member100.setPwd(encoder.encode("admin106"));
            member100.setName("admin106");
            member100.setPhone("010-1111-1228");
            memberMapper.save(member100);
        });

        member100.setEmail("a".repeat(256));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            member100.setUserId("admin107");
            member100.setPwd(encoder.encode("admin107"));
            member100.setName("admin107");
            member100.setPhone("010-1111-1229");
            memberMapper.save(member100);
        });

        member100.setEmail("admin100@gmail.com");
    }

    @Test
    @Order(14)
    @DisplayName("phone 20자 제한 테스트")
    void phone() {
        member100.setPhone("a".repeat(20));
        assertDoesNotThrow(() -> {
            member100.setUserId("admin108");
            member100.setPwd(encoder.encode("admin108"));
            member100.setName("admin108");
            member100.setEmail("admin108@gmail.com");
            memberMapper.save(member100);
        });

        member100.setPhone("a".repeat(21));
        assertThrowsExactly(DataIntegrityViolationException.class, () -> {
            member100.setUserId("admin109");
            member100.setPwd(encoder.encode("admin109"));
            member100.setName("admin109");
            member100.setEmail("admin109@gmail.com");
            memberMapper.save(member100);
        });

        member100.setPhone("010-1111-1222");
    }
}