package com.anamensis.server.service;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.mapper.EmailVerifyMapper;
import com.anamensis.server.provider.AwsSesMailProvider;
import com.anamensis.server.provider.EmailVerifyProvider;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerifyService {

    private final EmailVerifyMapper emailVerifyMapper;

    private final EmailVerifyProvider emailVerifyProvider;

    private final AwsSesMailProvider awsSesMailProvider;


    public Mono<String> insert(EmailVerify emailVerify) {
        if(emailVerify == null || emailVerify.getEmail() == null) {
            return Mono.error(new RuntimeException("email is null"));
        }

        String code = emailVerifyProvider.generateCode();

        emailVerify.setCode(code);
        emailVerify.setCreateAt(LocalDateTime.now());
        emailVerify.setExpireAt(LocalDateTime.now().plusMinutes(10));

        return Mono.fromCallable(()-> emailVerifyMapper.insert(emailVerify))
                .onErrorMap(e -> new RuntimeException("insert failed"))
                .flatMap(i ->
                        i == 1 ? Mono.just(code)
                               : Mono.error(new RuntimeException("insert failed"))
                )
                .flatMap(codeStr -> {
                    try {
                        awsSesMailProvider.verifyEmail(codeStr, emailVerify.getEmail());
                        return Mono.just(codeStr);
                    } catch (MessagingException e) {
                        return Mono.error(new RuntimeException(e.getMessage()));
                    }
                });
    }

    public Mono<Boolean> updateIsUse(EmailVerify emailVerify) {
        if(emailVerify == null || emailVerify.getEmail() == null || emailVerify.getCode() == null) {
            return Mono.error(new RuntimeException("email or code is null"));
        }
        emailVerify.setExpireAt(LocalDateTime.now());
        return Mono.justOrEmpty(emailVerifyMapper.selectByEmailAndCode(emailVerify))
                .switchIfEmpty(Mono.error(new RuntimeException("not found")))
                .flatMap(e -> {
                    e.setUse(true);
                    return Mono.fromCallable(()->
                            emailVerifyMapper.updateIsUse(e) == 1
                    );
                })
                .onErrorReturn(false);
    }

}
