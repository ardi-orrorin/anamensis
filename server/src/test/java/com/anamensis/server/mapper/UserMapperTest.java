package com.anamensis.server.mapper;

import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.User;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest
@ActiveProfiles("local")
class UserMapperTest {

    @SpyBean
    private UserMapper userMapper;

    @SpyBean
    private BCryptPasswordEncoder encoder;

    private Logger log = org.slf4j.LoggerFactory.getLogger(UserMapperTest.class);

    @Test
    void findAllUsers() {
        log.info("{}", userMapper.findAllUsers());
    }

    @Test
    void findUserByUserId() {
        log.info("{}", userMapper.findUserByUserId("admin1"));
    }

    @Test
    @Transactional
    void save() {
        String encodePwd = encoder.encode("admin3");
        User user = User.builder()
                .userId("admin3")
                .pwd(encodePwd)
                .name("admin")
                .email("tes1t@test1.com")
                .phone("010-1221-1112")
                .isUse(true)
                .build();
        userMapper.save(user);
        log.info("{}", user);
    }

    @Test
    void findUserInfo() {
        log.info("{}", userMapper.findUserInfo("admin"));
    }

    @Test
    void enumTest() {
        log.info("{}", RoleType.valueOf("ADMIN"));
    }

    @Test
    void saveRole() {
        User user = userMapper.findUserByUserId("admin").get();

        Role role = new Role();
        role.setUserPk(user.getId());
        role.setRole(RoleType.MASTER);

        userMapper.saveRole(role);
    }

    @Test
    void deleteRole() {

        User user = userMapper.findUserByUserId("admin").get();

        Role role = new Role();
        role.setUserPk(user.getId());
        role.setRole(RoleType.MASTER);

        userMapper.deleteRole(role);
    }

    @Test
    void existsUser() {
        UserRequest.existsUser existsUser = new UserRequest.existsUser();
        existsUser.setType("id");
        existsUser.setValue("admin");

        log.info("{}", userMapper.existsUser(existsUser));
    }

    @Test
    void editAuth() {
        userMapper.editAuth(2, false, AuthType.NONE);
    }

    @Test
    void updatePoint() {
        userMapper.updatePoint(1, 100);
    }
}