package com.anamensis.server.service;

import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.User;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @SpyBean
    private UserService userService;

    @SpyBean
    private BCryptPasswordEncoder encoder;


    private Logger log = org.slf4j.LoggerFactory.getLogger(UserServiceTest.class);


    @Test
    void findUserByUserIdAndPwd() {
        userService.findUserByUserId("admin", "admin")
                .log();

    }

    @Test
    void findByUsername() {
    }

    @Test
    void save() {
        String encodePwd = encoder.encode("admin3");
//        User user = User.builder()
//                .userId("admin3")
//                .pwd(encodePwd)
//                .name("admin")
//                .email("test@test1.com")
//                .phone("010-1111-1112")
//                .isUse(true)
//                .build();
//        userService.saveUser(Mono.just(user));

        UserRequest.Register register = new UserRequest.Register();
        register.setId("admin3");
        register.setPwd(encodePwd);
        register.setName("admin");
        register.setEmail("admin3@test.com");
        register.setPhone("010-1111-1113");

        userService.saveUser(Mono.just(register));
    }

    @Test
    void testFindByUsername() {
        userService.findByUsername("admin")
                .log()
                .subscribe();
    }

    @Test
    void saveRole() {
        UserDetails user = new UserDto("admin", "admin", List.of());

        Mono<UserDetails> mono = Mono.just(user);
        mono.zipWith(Mono.just(RoleType.USER))
                .map(userService::saveRole)
                .log()
                .subscribe();
    }

    @Test
    void deleteRole() {
        UserDetails user = new UserDto("admin", "admin", List.of());
        Mono<UserDetails> mono = Mono.just(user);
        Mono<RoleType> roleType = Mono.just(RoleType.USER);
        mono.zipWith(roleType)
                .map(userService::deleteRole)
                .log()
                .subscribe();
    }

    @Test
    void existsUser() {
        UserRequest.existsUser existsUser = new UserRequest.existsUser();
        existsUser.setType("email");
        existsUser.setValue("test@icloud.com");
        userService.existsUser(existsUser)
                .log()
                .subscribe();
    }

    @Test
    void editAuth() {
        userService.editAuth(2, true)
                .log()
                .subscribe();
    }
}