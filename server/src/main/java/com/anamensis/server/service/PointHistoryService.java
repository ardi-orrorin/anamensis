package com.anamensis.server.service;

import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.mapper.PointHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointHistoryService {

    private final PointHistoryMapper pointHistoryMapper;

    public Mono<List<PointHistory>> selectByPointHistory(PointHistory pointHistory) {
        return Mono.just(pointHistoryMapper.selectByPointHistory(pointHistory));
    }

    @Transactional
    public Mono<Boolean> insert(PointHistory pointHistory) {
        int result = pointHistoryMapper.insert(pointHistory);

        if (result != 1 ) throw new RuntimeException("insert 실패");

        return Mono.just(true);
    }

}
