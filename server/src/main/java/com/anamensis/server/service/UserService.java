package com.anamensis.server.service;


import com.anamensis.server.dto.UserDto;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.User;
import com.anamensis.server.exception.DuplicateUserException;
import com.anamensis.server.mapper.UserMapper;
import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.resultMap.UserResultMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.util.Logger;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements ReactiveUserDetailsService {

    private final UserMapper userMapper;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public User findUserByUserId(String userId) {
        return userMapper.findUserByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
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

    public Mono<Boolean> existsUser(UserRequest.existsUser existsUser) {
        return Mono.just(userMapper.existsUser(existsUser));
    }

    @Transactional
    public Mono<User> saveUser(Mono<UserRequest.Register> user) {
        return user.map(UserRequest.Register::transToUser)
                   .doOnNext(u -> u.setPwd(bCryptPasswordEncoder.encode(u.getPwd())))
                   .doOnNext(u -> u.setCreateAt(LocalDateTime.now()))
                   .doOnNext(userMapper::save)
                   .doOnNext(u -> userMapper.saveRole(generateRole(u, RoleType.USER)))
                   .onErrorMap(e -> new DuplicateUserException(e.getMessage(), HttpStatus.BAD_REQUEST));
    }

    @Transactional
    public Integer saveRole(Tuple2<UserDetails, RoleType> tuple) {
        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
                .mapT1(user -> generateRole(user, tuple.getT2()))
                .mapT1(userMapper::saveRole)
                .getT1();

    }

    @Transactional
    public Integer deleteRole(Tuple2<UserDetails, RoleType> tuple) {
        return tuple.mapT1(ud -> findUserByUserId(ud.getUsername()))
                .mapT1(user -> generateRole(user, tuple.getT2()))
                .mapT1(userMapper::deleteRole)
                .getT1();
    }


    private Role generateRole(User user, RoleType roleType) {
        Role role = new Role();
        role.setUserPk(user.getId());
        role.setRole(roleType);
        return role;
    }

}
