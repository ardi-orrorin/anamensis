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
        return Mono.justOrEmpty(systemMessageMapper.findById(id))
                .switchIfEmpty(Mono.error(new RuntimeException("Not found id: " + id)));
    }

    public Mono<List<SystemMessage>> findByWebSysPk(String webSysPk) {
        return Mono.justOrEmpty(systemMessageMapper.findByWebSysPk(webSysPk));
    }

    public Mono<Boolean> save(SystemMessage sm) {
        sm.setCreateAt(LocalDateTime.now());
        sm.setUpdateAt(LocalDateTime.now());
        return Mono.fromRunnable(() -> systemMessageMapper.save(sm))
                .thenReturn(true)
                .onErrorReturn(false);
    }

    public Mono<Boolean> update(SystemMessage sm) {
        sm.setUpdateAt(LocalDateTime.now());

        return Mono.fromCallable(()-> systemMessageMapper.update(sm) > 0)
                .onErrorReturn(false);

    }

    public Mono<Boolean> updateIsUse(int id, boolean isUse) {
        return Mono.fromCallable(() -> systemMessageMapper.updateIsUse(id, isUse, LocalDateTime.now()) > 0)
                .onErrorReturn(false);

    }

    public Mono<Boolean> delete(int id) {
        ;
        return Mono.fromCallable(() -> systemMessageMapper.delete(id) > 0)
                .onErrorReturn(false);
    }

}
