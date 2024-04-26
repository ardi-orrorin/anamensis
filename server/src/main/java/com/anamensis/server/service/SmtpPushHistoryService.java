package com.anamensis.server.service;

import com.anamensis.server.dto.response.SmtpPushHistoryResponse;
import com.anamensis.server.entity.SmtpPushHistory;
import com.anamensis.server.mapper.SmtpPushHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class SmtpPushHistoryService {

    private final SmtpPushHistoryMapper smtpPushHistoryMapper;

    public Mono<Long> countByUserPk(long userPk) {
        return Mono.just(smtpPushHistoryMapper.countByUserPk(userPk));
    }

    public Flux<SmtpPushHistoryResponse.ListSmtpPushHistory> findByUserPk(long userPk) {
        return Flux.fromIterable(smtpPushHistoryMapper.findByUserPk(userPk))
                .map(SmtpPushHistoryResponse.ListSmtpPushHistory::fromResultMap);
    }

    public Mono<SmtpPushHistory> findById(long id) {
        return Mono.justOrEmpty(smtpPushHistoryMapper.findById(id))
                   .switchIfEmpty(Mono.error(new RuntimeException("Not found id: " + id)));
    }

}
