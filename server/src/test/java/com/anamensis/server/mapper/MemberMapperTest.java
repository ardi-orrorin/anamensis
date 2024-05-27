package com.anamensis.server.mapper;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.resultMap.MemberResultMap;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
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
class MemberMapperTest {

    @SpyBean
    static MemberMapper memberMapper;

    @SpyBean
    private static BCryptPasswordEncoder encoder;

    private Logger log = org.slf4j.LoggerFactory.getLogger(MemberMapperTest.class);
    Member member1 = new Member();
    Member member2 = new Member();

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

    }
    @Test
    void findAllUsers() {
        List<Member> member = memberMapper.findAllMember();
        assertEquals(2, member.size());

        // not null
        member.forEach(m -> {
            assertNotEquals(0, m.getId());
            assertNotNull(m.getUserId());
            assertNotNull(m.getName());
            assertNotNull(m.getEmail());
            assertNotNull(m.getPhone());
            assertNotNull(m.getCreateAt());
        });

        Member member1 = member.get(0);
        assertEquals("admin1", member1.getUserId());
        assertEquals("admin1", member1.getName());
        assertEquals("admin1@gmail.com", member1.getEmail());
        assertEquals("010-1111-1111", member1.getPhone());
        assertTrue(member1.isUse());

        Member member2 = member.get(1);
        assertEquals("admin2", member2.getUserId());
        assertEquals("admin2", member2.getName());
        assertEquals("admin2@gmail.com", member2.getEmail());
        assertEquals("010-1111-2222", member2.getPhone());
        assertTrue(member2.isUse());

        log.info("{}", member2);
    }

    @Test
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
    void deleteRole() {

        Role role1 = memberMapper.findMemberInfo("admin2").get().getRoles().get(0);
        Role role2 = memberMapper.findMemberInfo("admin2").get().getRoles().get(1);

        assertDoesNotThrow(() -> memberMapper.deleteRole(role1));

        assertEquals(0, memberMapper.deleteRole(role1));

        assertDoesNotThrow(() -> memberMapper.deleteRole(role2));
    }

    @Test
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
    void editAuth() {
        Member member = memberMapper.findMemberByUserId("admin1").get();

        assertDoesNotThrow(() -> memberMapper.editAuth(member.getId(), false, AuthType.NONE));

        assertDoesNotThrow(() -> memberMapper.editAuth(member.getId(), true, AuthType.OTP));

        assertEquals(AuthType.OTP, memberMapper.findMemberByUserId("admin1").get().getSAuthType());
        assertTrue(memberMapper.findMemberByUserId("admin1").get().getSAuth());

    }

    @Test
    void updatePoint() {
        Member member = memberMapper.findMemberByUserId("admin1").get();

        assertDoesNotThrow(() -> memberMapper.updatePoint(member.getId(), 100));
        assertEquals(100, memberMapper.findMemberByUserId("admin1").get().getPoint());

        assertDoesNotThrow(() -> memberMapper.updatePoint(member.getId(), 200));
        assertEquals(300, memberMapper.findMemberByUserId("admin1").get().getPoint());

        assertDoesNotThrow(() -> memberMapper.updatePoint(member.getId(), -50));
        assertEquals(250, memberMapper.findMemberByUserId("admin1").get().getPoint());
    }
}