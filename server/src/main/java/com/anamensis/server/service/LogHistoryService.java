package com.anamensis.server.service;


import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.mapper.LogHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Transactional
public class LogHistoryService {

    private final LogHistoryMapper logHistoryMapper;

    public Mono<Object> save(LogHistory logHistory) {

        return Mono.fromRunnable(() -> logHistoryMapper.save(logHistory))
                .onErrorMap(t -> new RuntimeException("로그 저장에 실패했습니다."))
                .flatMap($ -> Mono.empty());
    }
}
