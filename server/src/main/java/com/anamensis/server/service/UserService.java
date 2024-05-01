package com.anamensis.server.service;


import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.User;
import com.anamensis.server.exception.DuplicateUserException;
import com.anamensis.server.mapper.UserMapper;
import com.anamensis.server.resultMap.UserResultMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements ReactiveUserDetailsService {

    private final UserMapper userMapper;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Mono<User> findUserByUserId(String userId) {
        return Mono.justOrEmpty(userMapper.findUserByUserId(userId))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
    }

    public Mono<User> findUserByUserId(String userId, String pwd) {
        return Mono.justOrEmpty(userMapper.findUserByUserId(userId))
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
                .onErrorMap(e -> new RuntimeException("User not found"))
                .doOnNext(user -> {
                    if (!bCryptPasswordEncoder.matches(pwd, user.getPwd())) {
                        throw new RuntimeException("Password not matched");
                    }
                });
    }

    public Mono<UserResultMap> findUserInfo(String userId) {
        return Mono.justOrEmpty(userMapper.findUserInfo(userId))
                .onErrorMap(e -> new RuntimeException("User not found"));
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.justOrEmpty(userMapper.findUserInfo(username))
                .map(user -> new UserDto(
                        user.getUser().getUserId(),
                        bCryptPasswordEncoder.encode(user.getUser().getPwd()),
                        user.getRoles().stream().map(Role::getRole).toList()
                ));
    }

    public Mono<Void> updatePoint(long userPk, int point) {
        userMapper.updatePoint(userPk, point);
        return Mono.empty();
    }

    public Mono<Boolean> existsUser(UserRequest.existsUser existsUser) {
        return Mono.just(userMapper.existsUser(existsUser));
    }

    public Mono<Boolean> editAuth(long id, boolean isAuth, AuthType authType) {
        return Mono.just(userMapper.editAuth(id, isAuth, authType))
                .map(i -> i > 0);
    }

    @Transactional
    public Mono<User> saveUser(Mono<UserRequest.Register> user) {
        return user.map(UserRequest.Register::transToUser)
                   .doOnNext(u -> u.setPwd(bCryptPasswordEncoder.encode(u.getPwd())))
                   .doOnNext(u -> u.setCreateAt(LocalDateTime.now()))
                   .doOnNext(userMapper::save)
                   .publishOn(Schedulers.boundedElastic())
                   .doOnNext(u -> generateRole(u, RoleType.USER)
                           .doOnNext(userMapper::saveRole)
                           .subscribe()
                   )
                   .onErrorMap(e -> new DuplicateUserException(e.getMessage(), HttpStatus.BAD_REQUEST));
    }

    @Transactional
    public Mono<Integer> saveRole(Tuple2<UserDetails, RoleType> tuple) {
        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
                .mapT1(user -> user.flatMap(u -> generateRole(u, tuple.getT2()))
                )
                .mapT1(user -> user.map(userMapper::saveRole))
                .getT1();

    }

    @Transactional
    public Mono<Boolean> updateUser(User user) {
        return Mono.just(userMapper.update(user))
                .map(i -> i == 1);
    }

    @Transactional
    public Mono<Integer> deleteRole(Tuple2<UserDetails, RoleType> tuple) {
        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
                .mapT1(user -> user.flatMap(u -> generateRole(u, tuple.getT2())))
                .mapT1(user -> user.map(userMapper::deleteRole))
                .getT1();
    }


    private Mono<Role> generateRole(User user, RoleType roleType) {
        Role role = new Role();
        role.setUserPk(user.getId());
        role.setRole(roleType);
        return Mono.just(role);
    }

}
