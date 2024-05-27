package com.anamensis.server.mapper;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.Users;
import com.anamensis.server.resultMap.UsersResultMap;
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
class UsersMapperTest {

    @SpyBean
    static UsersMapper usersMapper;

    @SpyBean
    private static BCryptPasswordEncoder encoder;

    private Logger log = org.slf4j.LoggerFactory.getLogger(UsersMapperTest.class);
    Users users1 = new Users();
    Users users2 = new Users();

    Role role2 = new Role();

    @BeforeAll
    void setup() {

        users1.setUserId("admin1");
        users1.setPwd(encoder.encode("admin1"));
        users1.setName("admin1");
        users1.setEmail("admin1@gmail.com");
        users1.setPhone("010-1111-1111");
        users1.setUse(true);
        users1.setCreateAt(LocalDateTime.now());
        usersMapper.save(users1);

        users2.setUserId("admin2");
        users2.setPwd(encoder.encode("admin2"));
        users2.setName("admin2");
        users2.setEmail("admin2@gmail.com");
        users2.setPhone("010-1111-2222");
        users2.setUse(true);
        users2.setCreateAt(LocalDateTime.now());
        usersMapper.save(users2);

        role2.setUserPk(users2.getId());
        role2.setRole(RoleType.ADMIN);
        usersMapper.saveRole(role2);

        role2.setUserPk(users2.getId());
        role2.setRole(RoleType.USER);
        usersMapper.saveRole(role2);

    }
    @Test
    void findAllUsers() {
        List<Users> users = usersMapper.findAllUsers();
        assertEquals(2, users.size());

        // not null
        users.forEach(user -> {
            assertNotEquals(0, user.getId());
            assertNotNull(user.getUserId());
            assertNotNull(user.getName());
            assertNotNull(user.getEmail());
            assertNotNull(user.getPhone());
            assertNotNull(user.getCreateAt());
        });

        Users user1 = users.get(0);
        assertEquals("admin1", user1.getUserId());
        assertEquals("admin1", user1.getName());
        assertEquals("admin1@gmail.com", user1.getEmail());
        assertEquals("010-1111-1111", user1.getPhone());
        assertTrue(user1.isUse());

        Users user2 = users.get(1);
        assertEquals("admin2", user2.getUserId());
        assertEquals("admin2", user2.getName());
        assertEquals("admin2@gmail.com", user2.getEmail());
        assertEquals("010-1111-2222", user2.getPhone());
        assertTrue(user2.isUse());

        log.info("{}", users);
    }

    @Test
    void findUserByUserId() {

        assertTrue(usersMapper.findUserByUserId("admin").isEmpty());
        assertThrowsExactly(NoSuchElementException.class, () -> usersMapper.findUserByUserId("admin3").get());

        assertTrue(usersMapper.findUserByUserId("admin1").isPresent());
        assertNotNull(usersMapper.findUserByUserId("admin1").get());

        usersMapper.findUserByUserId("admin1")
                .ifPresentOrElse(user -> {
                    assertEquals("admin1", user.getUserId());
                    assertEquals("admin1", user.getName());
                    assertEquals("admin1@gmail.com", user.getEmail());
                    assertEquals("010-1111-1111", user.getPhone());
                    assertTrue(user.isUse());
                    log.info("{}", user);
                }, () -> fail("user not found"));

    }

    @Test
    @Transactional
    void save() {
        Users users = new Users();
        String pwd = encoder.encode("admin3");

        users.setUserId("admin3");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> usersMapper.save(users));

        users.setPwd(pwd);
        assertThrowsExactly(DataIntegrityViolationException.class, () -> usersMapper.save(users));

        users.setName("admin3");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> usersMapper.save(users));

        users.setEmail("admin3@gmail.com");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> usersMapper.save(users));

        users.setPhone("010-1111-3333");
        assertThrowsExactly(DataIntegrityViolationException.class, () -> usersMapper.save(users));

        users.setCreateAt(LocalDateTime.now());
        users.setUse(true);

        assertDoesNotThrow(() -> usersMapper.save(users));

        // 무결성 테스트
        assertThrowsExactly(DuplicateKeyException.class, () -> usersMapper.save(users));

        users.setUserId("admin4");
        assertThrowsExactly(DuplicateKeyException.class, () -> usersMapper.save(users));

        users.setPwd(encoder.encode("admin3"));
        assertThrowsExactly(DuplicateKeyException.class, () -> usersMapper.save(users));

        users.setEmail("admin4@gmail.com");
        assertThrowsExactly(DuplicateKeyException.class, () -> usersMapper.save(users));

        users.setPhone("010-1111-4444");
        usersMapper.save(users);
    }

    @Test
    void findUserInfo() {
        // 없는 유저
        assertTrue(usersMapper.findUserInfo("admin").isEmpty());
        assertThrowsExactly(NoSuchElementException.class, () -> usersMapper.findUserInfo("admin").get());

        // role 이 없는 경우
        assertFalse(usersMapper.findUserInfo("admin1").isPresent());
        assertThrowsExactly(NoSuchElementException.class, () -> usersMapper.findUserInfo("admin1").get());

        // role 이 있는 경우
        assertTrue(usersMapper.findUserInfo("admin2").isPresent());
        assertNotNull(usersMapper.findUserInfo("admin2").get());

        UsersResultMap usersResultMap = usersMapper.findUserInfo("admin2").get();
        assertNotNull(usersResultMap.getUsers());
        assertNotNull(usersResultMap.getRoles());
        assertEquals(2, usersResultMap.getRoles().size());


        usersResultMap.getRoles().forEach(role -> {
            assertNotEquals(0, role.getUserPk());
            assertNotNull(role.getRole());
        });

        Users users = usersResultMap.getUsers();
        assertEquals("admin2", users.getUserId());
        assertEquals("admin2", users.getName());
        assertEquals("admin2@gmail.com", users.getEmail());
        assertEquals("010-1111-2222", users.getPhone());
        assertTrue(users.isUse());

    }

    @Test
    void saveRole() {
        Users users1 = usersMapper.findUserByUserId("admin1").get();
        Users users2 = usersMapper.findUserByUserId("admin2").get();

        Role role1 = new Role();
        role1.setUserPk(users1.getId());
        role1.setRole(RoleType.ADMIN);
        assertDoesNotThrow(() -> usersMapper.saveRole(role1));

        Role role2 = new Role();
        role2.setUserPk(users2.getId());
        role2.setRole(RoleType.ADMIN);
        assertThrows(DuplicateKeyException.class ,() -> usersMapper.saveRole(role2));

        role2.setRole(RoleType.MASTER);
        assertDoesNotThrow(() -> usersMapper.saveRole(role2));
    }

    @Test
    void deleteRole() {

        Role role1 = usersMapper.findUserInfo("admin2").get().getRoles().get(0);
        Role role2 = usersMapper.findUserInfo("admin2").get().getRoles().get(1);

        assertDoesNotThrow(() -> usersMapper.deleteRole(role1));

        assertEquals(0, usersMapper.deleteRole(role1));

        assertDoesNotThrow(() -> usersMapper.deleteRole(role2));
    }

    @Test
    void existsUser() {
        UserRequest.existsUser existsUser = new UserRequest.existsUser();
        existsUser.setType("id");
        existsUser.setValue("admin");

        assertFalse(usersMapper.existsUser(existsUser));
        existsUser.setValue("admin1");
        assertTrue(usersMapper.existsUser(existsUser));

        existsUser.setType("email");
        assertFalse(usersMapper.existsUser(existsUser));

        existsUser.setValue("admin1@gmail.com");
        assertTrue(usersMapper.existsUser(existsUser));

        existsUser.setValue("admin1@naver.com");
        assertFalse(usersMapper.existsUser(existsUser));

        existsUser.setType("phone");
        assertFalse(usersMapper.existsUser(existsUser));

        existsUser.setValue("010-2222-1111");
        assertFalse(usersMapper.existsUser(existsUser));

        existsUser.setValue("010-1111-1111");
        assertTrue(usersMapper.existsUser(existsUser));
    }

    @Test
    void editAuth() {
        Users users = usersMapper.findUserByUserId("admin1").get();

        assertDoesNotThrow(() -> usersMapper.editAuth(users.getId(), false, AuthType.NONE));

        assertDoesNotThrow(() -> usersMapper.editAuth(users.getId(), true, AuthType.OTP));

        assertEquals(AuthType.OTP, usersMapper.findUserByUserId("admin1").get().getSAuthType());
        assertTrue(usersMapper.findUserByUserId("admin1").get().getSAuth());

    }

    @Test
    void updatePoint() {
        Users users = usersMapper.findUserByUserId("admin1").get();

        assertDoesNotThrow(() -> usersMapper.updatePoint(users.getId(), 100));
        assertEquals(100, usersMapper.findUserByUserId("admin1").get().getPoint());

        assertDoesNotThrow(() -> usersMapper.updatePoint(users.getId(), 200));
        assertEquals(300, usersMapper.findUserByUserId("admin1").get().getPoint());

        assertDoesNotThrow(() -> usersMapper.updatePoint(users.getId(), -50));
        assertEquals(250, usersMapper.findUserByUserId("admin1").get().getPoint());
    }
}