package com.anamensis.server.service;


import com.anamensis.server.entity.UserConfigSmtp;
import com.anamensis.server.mapper.UserConfigSmtpMapper;
import com.anamensis.server.provider.MailProvider;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class UserConfigSmtpService {
    private final UserConfigSmtpMapper userConfigSmtpMapper;


    public Flux<UserConfigSmtp> selectByUserPk(long userPk) {
        return Mono.just(userPk)
                .map(userConfigSmtpMapper::selectByUserPk)
                .flatMapMany(Flux::fromIterable)
                .onErrorMap(throwable -> new RuntimeException("UserConfigSmtp not found"));
    }

    public Mono<UserConfigSmtp> selectById(long id) {
        return Mono.just(id)
                .map(userConfigSmtpMapper::selectById)
                .flatMap(optional -> optional.map(Mono::just).orElseThrow())
                .onErrorMap(throwable -> new RuntimeException("UserConfigSmtp not found"));
    }

    public Mono<UserConfigSmtp> save(UserConfigSmtp userConfigSmtp) {
        return Mono.just(userConfigSmtp)
                .doOnNext(userConfigSmtpMapper::save)
                .onErrorMap(throwable -> new RuntimeException("UserConfigSmtp not save"));
    }

    public Mono<Boolean> update(UserConfigSmtp userConfigSmtp) {
        return Mono.just(userConfigSmtp)
                .map(userConfigSmtpMapper::update)
                .<Boolean>handle((r, sink) -> {
                    if (r == 0) {
                        sink.error(new RuntimeException("UserConfigSmtp not update"));
                    } else {
                        sink.next(true);
                    }
                })
                .onErrorMap(throwable -> new RuntimeException("UserConfigSmtp not update"));
    }

    public Mono<Boolean> testConnection(UserConfigSmtp userConfigSmtp) {
        return Mono.just(userConfigSmtp)
                .doOnNext(u -> {
                    try {
                        new MailProvider.Builder()
                                .config(u)
                                .build()
                                .testConnection();
                    } catch (MessagingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .log()
                .map(u -> true)
                .onErrorReturn(false);
    }


    public Mono<Boolean> deleteByUserPk(long userPk) {
        userConfigSmtpMapper.deleteByUserPk(userPk);
        return Mono.just(true);
    }

    public Mono<Boolean> deleteById(long id) {
        userConfigSmtpMapper.deleteById(id);
        return Mono.just(true);
    }
}
