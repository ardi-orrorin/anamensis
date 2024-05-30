package com.anamensis.server.service;

import com.anamensis.server.entity.PointCode;
import com.anamensis.server.mapper.PointCodeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PointService {

    @Value("${db.setting.user.attendance_point_code_prefix}")
    private String ATTENDANCE_POINT_CODE_PREFIX;

    private final PointCodeMapper pointCodeMapper;

    public Mono<List<PointCode>> selectAll() {
        return Mono.just(pointCodeMapper.selectAll());
    }

//    public Mono<List<PointCode>> selectByIdOrName(PointCode pointCode) {
//        return Mono.just(pointCodeMapper.selectByIdOrName(pointCode));
//    }

    public Mono<PointCode> selectByIdOrName(String seq) {
        return Mono.justOrEmpty(pointCodeMapper.selectByIdOrName(0, ATTENDANCE_POINT_CODE_PREFIX + seq))
                .switchIfEmpty(Mono.error(new RuntimeException("not found")));
    }

    public Mono<Boolean> insert(PointCode pointCode) {
        return Mono.just(true)
                .flatMap(r -> Mono.just(pointCodeMapper.insert(pointCode)))
                .flatMap(r ->
                    r == 1 ? Mono.just(true)
                           : Mono.error(new RuntimeException("insert fail")))
                .onErrorReturn(false);

    }


}
