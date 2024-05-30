package com.anamensis.server.service;


import com.anamensis.server.entity.MemberConfigSmtp;
import com.anamensis.server.mapper.MemberConfigSmtpMapper;
import com.anamensis.server.provider.MailProvider;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberConfigSmtpService {
    private final MemberConfigSmtpMapper userConfigSmtpMapper;

    public Flux<MemberConfigSmtp> selectByUserPk(long memberPk) {
        return Mono.just(memberPk)
                .map(userConfigSmtpMapper::selectByMemberPk)
                .flatMapMany(Flux::fromIterable);
    }

    public Mono<MemberConfigSmtp> selectById(long id) {
        return Mono.justOrEmpty(userConfigSmtpMapper.selectById(id))
                .switchIfEmpty(Mono.error(new RuntimeException("UserConfigSmtp not found")));
    }

    public Mono<MemberConfigSmtp> save(MemberConfigSmtp userConfigSmtp) {
        return Mono.just(userConfigSmtp)
                .doOnNext(u -> {
                    if (u.getIsDefault()) {
                        userConfigSmtpMapper
                                .disabledDefaults(u.getMemberPk());
                    }
                })
                .doOnNext(userConfigSmtpMapper::save)
                .onErrorMap(throwable -> new RuntimeException("UserConfigSmtp not save"));
    }

    public Mono<Boolean> update(MemberConfigSmtp userConfigSmtp) {
        return Mono.just(userConfigSmtp)
                .map(userConfigSmtpMapper::update)
                .flatMap(b ->
                    b > 0 ? Mono.just(true)
                          : Mono.error(new RuntimeException("UserConfigSmtp not update"))
                );
    }

    public Mono<Boolean> testConnection(MemberConfigSmtp userConfigSmtp) {
        return Mono.just(userConfigSmtp)
                .doOnNext(u ->  new MailProvider.Builder()
                        .config(u)
                        .build()
                        .testConnection()
                )
                .thenReturn(true)
                .onErrorReturn(false);
    }

    public Mono<Boolean> disabled(long id, long memberPk) {
        boolean isDefault = userConfigSmtpMapper.isDefault(id, memberPk);

        userConfigSmtpMapper.disabled(id, memberPk);

        if(isDefault) initDefault(memberPk);

        return Mono.just(true);
    }


    private void initDefault(long memberPk) {
        Optional<MemberConfigSmtp> smtp = userConfigSmtpMapper.selectFirstId(memberPk);

        if(smtp.isEmpty()) return ;

        MemberConfigSmtp userConfigSmtp = smtp.get();

        userConfigSmtp.setIsDefault(true);
        userConfigSmtpMapper.update(userConfigSmtp);
    }


}
