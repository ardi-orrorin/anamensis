package com.anamensis.server.service;

import com.anamensis.server.entity.PointCode;
import com.anamensis.server.mapper.PointCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointCodeMapper pointCodeMapper;

    public Mono<List<PointCode>> selectAll() {
        return Mono.just(pointCodeMapper.selectAll());
    }

    public Mono<List<PointCode>> selectByIdOrName(PointCode pointCode) {
        return Mono.just(pointCodeMapper.selectByIdOrName(pointCode));
    }

    public Mono<PointCode> findByName(String name) {
        return Mono.justOrEmpty(pointCodeMapper.findByName(name))
                .switchIfEmpty(Mono.error(new RuntimeException("not found")));
    }

    @Transactional
    public boolean insert(PointCode pointCode) {
        int result = pointCodeMapper.insert(pointCode);

        if(result != 1) new RuntimeException("insert fail");

        return true;
    }


}
