package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.PointHistoryRequest;
import com.anamensis.server.dto.response.PointHistoryResponse;
import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.mapper.PointHistoryMapper;
import com.anamensis.server.resultMap.PointHistoryResultMap;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PointHistoryService {

    private final PointHistoryMapper pointHistoryMapper;

    public Mono<Integer> count(
            PointHistoryRequest.Param param,
            long memberPk
    ) {
        return Mono.fromCallable(()-> pointHistoryMapper.count(param, memberPk))
                .onErrorReturn(0);
    }


    public Mono<List<PointHistoryResponse.List>> selectByPointHistory(
            PointHistoryRequest.Param param,
            Page page,
            long memberPk
    ) {
        return Flux.fromIterable(pointHistoryMapper.selectByPointHistory(page, param, memberPk))
                .map(PointHistoryResponse.List::fromResultMap)
                .collectList();
    }


    public Mono<Boolean> insert(PointHistory pointHistory) {
        return Mono.fromCallable(()-> pointHistoryMapper.insert(pointHistory) > 0)
                .onErrorReturn(false);
    }

    public Mono<List<PointHistoryResponse.Summary>> selectSummary(long memberPk) {
        Page page = new Page();
        page.setPage(1);
        page.setSize(5);
        return Flux.fromIterable(pointHistoryMapper.selectByPointHistory(page, null , memberPk))
            .map(PointHistoryResponse.Summary::fromResultMap)
            .collectList();
    }
}
