package com.anamensis.server.mapper;

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
        log.info("{}", userMapper.findUserByUserId("admin"));
//        userMapper.findUserByUserId("admin");
    }

    @Test
    @Transactional
    void save() {
        String encodePwd = encoder.encode("admin3");
        User user = new User(0, "admin3", encodePwd, "admin", "test@test1.com","010-1111-1112", null, null, true);
        userMapper.save(user);
    }

}