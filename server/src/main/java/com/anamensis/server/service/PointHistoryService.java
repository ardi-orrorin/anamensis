package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.PointHistoryRequest;
import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.mapper.PointHistoryMapper;
import com.anamensis.server.resultMap.PointHistoryResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PointHistoryService {

    private final PointHistoryMapper pointHistoryMapper;

    public Mono<List<PointHistoryResultMap>> selectByPointHistory(
            PointHistoryRequest.Param param,
            Page page
    ) {
        return Mono.just(pointHistoryMapper.selectByPointHistory(page, param));
    }


    public Mono<Boolean> insert(PointHistory pointHistory) {
        return Mono.fromCallable(()-> pointHistoryMapper.insert(pointHistory))
                .flatMap(r ->
                    r == 1 ? Mono.just(true)
                           : Mono.error(new RuntimeException("insert fail"))
                )
                .onErrorReturn(false);
    }

}
