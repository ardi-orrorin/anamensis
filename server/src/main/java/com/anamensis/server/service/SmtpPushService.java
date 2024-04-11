package com.anamensis.server.service;

import com.anamensis.server.entity.SmtpPush;
import com.anamensis.server.entity.UserConfigSmtp;
import com.anamensis.server.mapper.SmtpPushMapper;
import com.anamensis.server.provider.MailProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class SmtpPushService {

    private final SmtpPushMapper smtpPushMapper;

    public Mono<Boolean> send(UserConfigSmtp userConfigSmtp, SmtpPush smtpPush) {
        return Mono.just(smtpPush)
                .doOnNext(smtp -> {
                    smtp.setUserConfigSmtpPk(userConfigSmtp.getId());
                    smtp.setUserPk(userConfigSmtp.getUserPk());
                    smtp.setCreateAt(LocalDateTime.now());
                })
                .zipWith(Mono.just(userConfigSmtp))
                .doOnNext(t -> {
                    new MailProvider.Builder()
                            .config(t.getT2())
                            .message(t.getT2(), t.getT1().getSubject(), t.getT1().getContent())
                            .build()
                            .send()
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();
                })
                .map(t -> {
                    smtpPushMapper.save(t.getT1());
                    return true;
                });
    }
}
