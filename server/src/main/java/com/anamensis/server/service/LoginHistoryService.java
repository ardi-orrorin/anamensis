package com.anamensis.server.service;


import com.anamensis.server.dto.Device;
import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.Member;
import com.anamensis.server.mapper.LoginHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginHistoryService {
    private final LoginHistoryMapper loginHistoryMapper;


    public Mono<Integer> count(long userId) {
        return Mono.just(loginHistoryMapper.count(userId));
    }

    public Flux<LoginHistory> selectAll(Member users, Page page) {
        return Flux.fromIterable(loginHistoryMapper.selectAll(users, page));
    }

    @Transactional
    public Mono<Void> save(Device device, Member users) {
        LoginHistory loginHistory = LoginHistory.builder()
                .ip(device.getIp())
                .device(device.getDevice())
                .location(device.getLocation())
                .createAt(LocalDateTime.now())
                .build();

        int save = loginHistoryMapper.save(loginHistory, users);
        if(save != 1) throw new RuntimeException("LoginHistory save failed");
        return Mono.empty();
    }
}
