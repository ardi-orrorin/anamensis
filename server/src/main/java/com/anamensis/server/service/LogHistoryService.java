package com.anamensis.server.service;


import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.mapper.LogHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class LogHistoryService {

    private final LogHistoryMapper logHistoryMapper;

    public void save(LogHistory logHistory) {
        logHistoryMapper.save(logHistory);
    }
}
