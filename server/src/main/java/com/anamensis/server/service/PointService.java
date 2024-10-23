package com.anamensis.server.service;

import com.anamensis.server.dto.request.PointCodeRequest;
import com.anamensis.server.dto.response.PointCodeResponse;
import com.anamensis.server.entity.PointCode;
import com.anamensis.server.mapper.PointCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PointService {

    private final PointCodeMapper pointCodeMapper;

    public Mono<List<PointCodeResponse.ListItem>> selectAll() {
        return Flux.fromIterable(pointCodeMapper.selectAll())
                .map(PointCodeResponse.ListItem::fromEntity)
                .collectList();
    }

    public Mono<Boolean> update(PointCodeRequest.Update[] pointCodes) {

        return Flux.fromArray(pointCodes)
                .map(PointCodeRequest.Update::toEntity)
                .map(pointCodeMapper::update)
                .all(x -> x > 0)
                .onErrorReturn(false);
    }


    public Mono<PointCode> selectByTableName(String name) {
        return Mono.justOrEmpty(pointCodeMapper.selectByIdOrName(0, name))
                .switchIfEmpty(Mono.error(new RuntimeException("not found")));
    }

    public Mono<Boolean> insert(PointCode pointCode) {
        return Mono.fromCallable(() -> pointCodeMapper.insert(pointCode) > 0)
                .onErrorReturn(false);

    }

    public Mono<Boolean> resetById(List<Long> ids) {
        return Flux.fromIterable(ids)
                .map(pointCodeMapper::resetById)
                .all(x -> x > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> reset() {
        return Mono.fromCallable(() -> pointCodeMapper.reset() > 0)
                .onErrorReturn(false);
    }


}
