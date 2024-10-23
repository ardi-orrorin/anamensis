package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.response.SmtpPushHistoryResponse;
import com.anamensis.server.entity.SmtpPushHistory;
import com.anamensis.server.mapper.SmtpPushHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmtpPushHistoryService {

    private final SmtpPushHistoryMapper smtpPushHistoryMapper;

    private final VirtualThreadTaskExecutor virtualThreadTaskExecutor;

    public Mono<Long> count() {
        return Mono.just(smtpPushHistoryMapper.count());
    }

    public Flux<SmtpPushHistoryResponse.ListSmtpPushHistory> findAll(Page page) {
        return Flux.fromIterable(smtpPushHistoryMapper.findAll(page))
                .publishOn(Schedulers.fromExecutor(virtualThreadTaskExecutor))
                .map(SmtpPushHistoryResponse.ListSmtpPushHistory::fromEntity);
    }

    public Mono<SmtpPushHistory> findById(long id) {
        return Mono.justOrEmpty(smtpPushHistoryMapper.findById(id))
                   .switchIfEmpty(Mono.error(new RuntimeException("Not found id: " + id)));
    }

}
