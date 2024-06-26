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
        return Mono.fromCallable(() -> userConfigSmtpMapper.selectByMemberPk(memberPk))
                .flatMapMany(Flux::fromIterable);
    }

    public Mono<MemberConfigSmtp> selectById(long id, long memberPk) {
        return Mono.justOrEmpty(userConfigSmtpMapper.selectById(id, memberPk))
                .switchIfEmpty(Mono.error(new RuntimeException("UserConfigSmtp not found")));
    }

    public Mono<MemberConfigSmtp> save(MemberConfigSmtp userConfigSmtp) {
        try {
            if (userConfigSmtp.getIsDefault()) {
                userConfigSmtpMapper.disabledDefaults(userConfigSmtp.getMemberPk());
            }

            userConfigSmtpMapper.save(userConfigSmtp);

        } catch (Exception e) {
            return Mono.error(new RuntimeException("UserConfigSmtp not save"));
        }
        return Mono.just(userConfigSmtp);
    }

    public Mono<Boolean> update(MemberConfigSmtp userConfigSmtp) {
        return userConfigSmtpMapper.update(userConfigSmtp) > 0
                ? Mono.just(true)
                : Mono.error(new RuntimeException("UserConfigSmtp not update"));

    }

    public Mono<Boolean> testConnection(MemberConfigSmtp userConfigSmtp) {
        try {
            new MailProvider.Builder()
                    .config(userConfigSmtp)
                    .build()
                    .testConnection();
        } catch (Exception e) {
            return Mono.just(false);
        }
        return Mono.just(true);
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
