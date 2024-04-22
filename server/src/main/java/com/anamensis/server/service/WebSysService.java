package com.anamensis.server.service;

import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import com.anamensis.server.mapper.WebSysMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WebSysService {

    private final WebSysMapper webSysMapper;

    public Mono<List<WebSys>> findAll() {
        return Mono.just(webSysMapper.findAll());
    }

    public Mono<WebSys> findByCode(String code) {
        return Mono.justOrEmpty(webSysMapper.findByCode(code));
    }

    public Mono<List<WebSys>> findByPermission(RoleType permission) {
        return Mono.just(webSysMapper.findByPermission(permission));
    }

    public Mono<Void> save(WebSys webSys) {
        webSysMapper.save(webSys);
        return Mono.empty();
    }

    public Mono<Void> saveAll(List<WebSys> webSysList) {
        webSysMapper.saveAll(webSysList);
        return Mono.empty();
    }

    public Mono<Void> update(WebSys webSys) {
        webSysMapper.update(webSys);
        return Mono.empty();
    }

    public Mono<Void> deleteByCode(String code) {
        webSysMapper.deleteByCode(code);
        return Mono.empty();
    }


}
