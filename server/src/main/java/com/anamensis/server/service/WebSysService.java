package com.anamensis.server.service;

import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import com.anamensis.server.mapper.WebSysMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WebSysService {

    private final WebSysMapper webSysMapper;

    public Mono<List<WebSys>> findAll() {
        return Mono.fromCallable(webSysMapper::findAll);
    }

    public Mono<WebSys> findByCode(String code) {
        return Mono.justOrEmpty(webSysMapper.findByCode(code))
                .switchIfEmpty(Mono.error(new RuntimeException("webSys not found")));
    }

    public Mono<List<WebSys>> findByPermission(RoleType permission) {
        return Mono.fromCallable(() -> webSysMapper.findByPermission(permission));
    }

    public Mono<Void> save(WebSys webSys) {
        if(webSys.getCode() == null || webSys.getName() == null || webSys.getPermission() == null) {
            return Mono.error(new IllegalArgumentException("Invalid WebSys"));
        }
        return Mono.fromRunnable(() -> webSysMapper.save(webSys));
    }

    public Mono<Void> saveAll(List<WebSys> webSysList) {
        return Mono.fromRunnable(() -> webSysMapper.saveAll(webSysList));
    }

    public Mono<Boolean> update(WebSys webSys) {
        return Mono.fromCallable(() -> webSysMapper.update(webSys) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> deleteByCode(String code) {
        return Mono.fromCallable(()-> webSysMapper.deleteByCode(code) > 0)
                .onErrorReturn(false);
    }


}
