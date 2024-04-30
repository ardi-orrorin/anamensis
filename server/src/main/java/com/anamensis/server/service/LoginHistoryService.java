package com.anamensis.server.service;


import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.LoginHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginHistoryService {
    private final LoginHistoryMapper loginHistoryMapper;


    public Mono<Integer> count(long userId) {
        return Mono.just(loginHistoryMapper.count(userId));
    }

    public Flux<LoginHistory> selectAll(User user, Page page) {
        return Flux.fromIterable(loginHistoryMapper.selectAll(user, page));
    }

    @Transactional
    public Mono<Void> save(Device device, User user) {
        LoginHistory loginHistory = LoginHistory.builder()
                .ip(device.getIp())
                .device(device.getDevice())
                .location(device.getLocation())
                .createAt(LocalDateTime.now())
                .build();

        int save = loginHistoryMapper.save(loginHistory, user);
        if(save != 1) throw new RuntimeException("LoginHistory save failed");
        return Mono.empty();
    }
}
