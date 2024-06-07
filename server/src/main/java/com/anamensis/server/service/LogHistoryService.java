package com.anamensis.server.service;


import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.mapper.LogHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LogHistoryService {

    private final LogHistoryMapper logHistoryMapper;

    public Mono<Void> save(LogHistory logHistory) {
        return Mono.fromRunnable(() -> logHistoryMapper.save(logHistory));
    }
}
