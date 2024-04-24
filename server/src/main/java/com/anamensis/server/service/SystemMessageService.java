package com.anamensis.server.service;

import com.anamensis.server.entity.SystemMessage;
import com.anamensis.server.mapper.SystemMessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemMessageService {

    private final SystemMessageMapper systemMessageMapper;

    public Mono<SystemMessage> findById(int id) {
        return Mono.justOrEmpty(systemMessageMapper.findById(id));
    }

    public Mono<List<SystemMessage>> findByWebSysPk(String webSysPk) {
        return Mono.justOrEmpty(systemMessageMapper.findByWebSysPk(webSysPk));
    }

    @Transactional
    public Mono<Boolean> save(SystemMessage sm) {
        sm.setCreateAt(LocalDateTime.now());
        sm.setUpdateAt(LocalDateTime.now());
        systemMessageMapper.save(sm);
        return Mono.just(true);
    }

    @Transactional
    public Mono<Boolean> update(SystemMessage sm) {
        sm.setUpdateAt(LocalDateTime.now());
        systemMessageMapper.update(sm);
        return Mono.just(true);
    }

    @Transactional
    public Mono<Boolean> updateIsUse(int id, boolean isUse) {

        systemMessageMapper.updateIsUse(id, isUse, LocalDateTime.now());
        return Mono.just(true);
    }

    @Transactional
    public Mono<Boolean> delete(int id) {
        systemMessageMapper.delete(id);
        return Mono.just(true);
    }

}
