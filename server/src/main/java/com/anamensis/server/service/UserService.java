package com.anamensis.server.service;


import com.anamensis.server.dto.UserDto;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.UserMapper;
import com.anamensis.server.provider.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements ReactiveUserDetailsService {

    private final UserMapper userMapper;

    private final TokenProvider token;

    public String findUserByUserIdAndPwd(String userId, String pwd) {
        User user = userMapper.findUserByUserIdAndPwd(userId, pwd)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // todo: generate token
        return token.generateToken(user.userId());
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.justOrEmpty(userMapper.findUserByUserId(username))
                .map(user -> new UserDto(user.userId(), user.pwd(), List.of()));

    }
}
