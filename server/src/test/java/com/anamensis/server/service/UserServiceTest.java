package com.anamensis.server.service;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.mapper.PointCodeMapper;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("dev")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class UserServiceTest {

    @SpyBean
    UserService us;

    @SpyBean
    PointCodeMapper pointCodeMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(UserServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("유저 아이디로 유저 찾기")
    void findUserByUserId() {
        StepVerifier.create(us.findUserByUserId("test"))
                .expectErrorMessage("User not found")
                .verify();

        StepVerifier.create(us.findUserByUserId("d-member-1"))
                .assertNext(user -> {
                    assertEquals(1, user.getId());
                    assertEquals("d-member-1", user.getUserId());
                    assertEquals("d-member-1", user.getName());
                    assertEquals("$2a$10$aV9tKjhmnZhE4gLdtHRw3O2Xa3VWZmOeOuDpbkETFYOl0wYK4haD.", user.getPwd());
                    assertEquals("010-0000-0001", user.getPhone());
                    assertEquals(0, user.getPoint());
                    assertEquals(AuthType.NONE, user.getSAuthType());
                })
                .verifyComplete();


        StepVerifier.create(us.findUserByUserId("d-member-11","1233123"))
                .expectErrorMessage("User not found")
                .verify();


        StepVerifier.create(us.findUserByUserId("d-member-2","1233123"))
            .expectErrorMessage("Password not matched")
            .verify();


        StepVerifier.create(us.findUserByUserId("d-member-4","d-member-4"))
                .assertNext(user -> {
                    assertEquals(4, user.getId());
                    assertEquals("d-member-4", user.getUserId());
                    assertEquals("d-member-4", user.getName());
                    assertEquals("010-0000-0004", user.getPhone());
                    assertEquals(100, user.getPoint());
                    assertEquals(AuthType.EMAIL, user.getSAuthType());
                })
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("유저 정보 찾기")
    void findUserInfoFail() {
        StepVerifier.create(us.findUserInfo("d-member-11"))
                .expectErrorMessage("User not found")
                .verify();

        StepVerifier.create(us.findUserInfo("d-member-1"))
                .assertNext(user -> {
                    Member m = user.getMember();
                    assertEquals(1, m.getId());
                    assertEquals("d-member-1", m.getUserId());
                    assertEquals("d-member-1", m.getName());
                    assertTrue(user.getRoles().stream().anyMatch(r -> r.getRole().equals(RoleType.ADMIN)));
                    assertTrue(user.getRoles().stream().anyMatch(r -> r.getRole().equals(RoleType.USER)));
                    assertTrue(user.getRoles().stream().anyMatch(r -> r.getRole().equals(RoleType.MASTER)));
                })
                .verifyComplete();
    }

    @Test
    @Order(3)
    @DisplayName("userDetails 테스트")
    void findByUsername() {
        StepVerifier.create(us.findByUsername("d-member-11"))
                .expectErrorMessage("User not found")
                .verify();

        StepVerifier.create(us.findByUsername("d-member-1"))
                .assertNext(user -> {
                    assertEquals("d-member-1", user.getUsername());
                    assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleType.ADMIN.name())));
                    assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleType.USER.name())));
                    assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleType.MASTER.name())));
                })
                .verifyComplete();
    }

    @Test
    @Order(4)
    @DisplayName("포인트 업데이트")
    void updatePoint() {
        StepVerifier.create(us.updatePoint(100, 100))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(us.updatePoint(1, 0))
                .expectErrorMessage("Point must be greater than 0")
                .verify();

        StepVerifier.create(us.updatePoint(1, 100))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(us.findUserByUserId("d-member-1"))
                .assertNext(user -> {
                    assertEquals(1, user.getId());
                    assertEquals("d-member-1", user.getUserId());
                    assertEquals("d-member-1", user.getName());
                    assertEquals("010-0000-0001", user.getPhone());
                    assertEquals(100, user.getPoint());
                    assertEquals(AuthType.NONE, user.getSAuthType());
                })
                .verifyComplete();
    }

    @Test
    @Order(5)
    @DisplayName("유저 존재 여부")
    void existsUser() {

        UserRequest.existsMember existsMember1 = new UserRequest.existsMember();
        existsMember1.setType("id");
        existsMember1.setValue("d-member-1");

        UserRequest.existsMember existsMember11 = new UserRequest.existsMember();
        existsMember11.setType("id");
        existsMember11.setValue("d-member-11");

        StepVerifier.create(us.existsUser(existsMember1))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(us.existsUser(existsMember11))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Order(6)
    @DisplayName("2차 인증 변경")
    void editAuth() {
        StepVerifier.create(us.editAuth(100, true, AuthType.EMAIL))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(us.editAuth(1, true, AuthType.EMAIL))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(us.findUserByUserId("d-member-1"))
                .assertNext(user -> {
                    assertEquals(1, user.getId());
                    assertEquals("d-member-1", user.getUserId());
                    assertEquals("d-member-1", user.getName());
                    assertEquals("010-0000-0001", user.getPhone());
                    assertEquals(0, user.getPoint());
                    assertTrue(user.getSAuth());
                    assertEquals(AuthType.EMAIL, user.getSAuthType());
                })
                .verifyComplete();
    }

    @Test
    void saveee() {
        UserRequest.Register register = new UserRequest.Register();
        register.setId("master");
        register.setPwd("master");
        register.setName("master");
        register.setEmail("");
        register.setPhone("");

        StepVerifier.create(us.saveUser(register, true))
                .assertNext(user -> {
                    assertEquals("master", user.getUserId());
                    assertEquals("master", user.getName());
                    assertEquals("", user.getEmail());
                    assertEquals("", user.getPhone());
                    assertEquals(10, user.getPoint());
                })
                .verifyComplete();
    }

    @Test
    @Order(7)
    @DisplayName("유저 저장")
    void saveUser() {
        UserRequest.Register register = new UserRequest.Register();
        register.setId("d-member-12");
        register.setPwd("d-member-12");
        register.setName("d-member-12");
        register.setPhone("010-1001-0001");
        register.setEmail("d-member-12@gmail.com");

        StepVerifier.create(us.saveUser(register, false))
                .assertNext(user -> {
                    assertEquals("d-member-12", user.getUserId());
                    assertEquals("d-member-12", user.getName());
                    assertEquals("d-member-12@gmail.com", user.getEmail());
                    assertEquals("010-1001-0001", user.getPhone());
                    assertEquals(10, user.getPoint());
                })
                .verifyComplete();


        StepVerifier.create(us.findUserByUserId("d-member-12","d-member-12"))
                .assertNext(user -> {
                    assertEquals("d-member-12", user.getUserId());
                    assertEquals("d-member-12", user.getName());
                    assertEquals("d-member-12@gmail.com", user.getEmail());
                    assertEquals("010-1001-0001", user.getPhone());
                    assertEquals(0, user.getPoint());
                    assertFalse(user.getSAuth());
                    assertEquals(AuthType.NONE, user.getSAuthType());
                })
                .verifyComplete();

    }

    @Test
    @Order(8)
    @DisplayName("유저 업데이트")
    void updateUser() {
        Member member = new Member();
        member.setId(1);

        StepVerifier.create(us.updateUser(member))
                .expectError(RuntimeException.class)
                .verify();

        member.setName("d-member-111");
        StepVerifier.create(us.updateUser(member))
                .expectNext(true)
                .verifyComplete();

        member.setName(null);
        member.setPhone("010-0000-0001");
        StepVerifier.create(us.updateUser(member))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(us.findUserByUserId("d-member-1"))
                .assertNext(user -> {
                    assertEquals("d-member-111", user.getName());
                    assertEquals("010-0000-0001", user.getPhone());
                })
                .verifyComplete();
    }

}