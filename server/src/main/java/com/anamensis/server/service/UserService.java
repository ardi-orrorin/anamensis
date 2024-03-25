package com.anamensis.server.service;


import com.anamensis.server.dto.UserDto;
import com.anamensis.server.entity.User;
import com.anamensis.server.exception.DuplicateUserException;
import com.anamensis.server.mapper.UserMapper;
import com.anamensis.server.provider.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements ReactiveUserDetailsService {

    private final UserMapper userMapper;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Mono<User> findUserByUserId(String userId, String pwd) {
        return Mono.justOrEmpty(userMapper.findUserByUserId(userId))
                .onErrorMap(e -> new RuntimeException("User not found"))
                .doOnNext(user -> {
                    if (!bCryptPasswordEncoder.matches(pwd, user.pwd())) {
                        throw new RuntimeException("Password not matched");
                    }
                });

    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.justOrEmpty(userMapper.findUserByUserId(username))
                .map(user -> new UserDto(
                        user.userId(),
                        bCryptPasswordEncoder.encode(user.pwd()),
                        List.of()
                ));

    }

//    @Transactional
    public Mono<Integer> saveUser(Mono<User> user) {
        return user.map(u -> new User(
                        0,        u.userId(),    bCryptPasswordEncoder.encode(u.pwd()),
                        u.name(),     u.email(),    u.phone(),
                        u.createAt(), u.updateAt(), true
                    ))
                   .map(userMapper::save)
                   .onErrorMap(e -> new DuplicateUserException(e.getMessage(), HttpStatus.BAD_REQUEST));
    }
}
