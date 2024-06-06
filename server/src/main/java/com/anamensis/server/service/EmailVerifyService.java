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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerifyService {

    private final EmailVerifyMapper emailVerifyMapper;

    private final EmailVerifyProvider emailVerifyProvider;

    private final AwsSesMailProvider awsSesMailProvider;


    public Mono<String> insert(EmailVerify emailVerify) {
        if (emailVerify == null || emailVerify.getEmail() == null) {
            return Mono.error(new RuntimeException("email is null"));
        }

        String code = emailVerifyProvider.generateCode();

        emailVerify.setCode(code);
        emailVerify.setCreateAt(LocalDateTime.now());
        emailVerify.setExpireAt(LocalDateTime.now().plusMinutes(10));


        int result = emailVerifyMapper.insert(emailVerify);
        if (result == 0) return Mono.error(new RuntimeException("insert failed"));


        try {
            awsSesMailProvider.verifyEmail(code, emailVerify.getEmail());
        } catch (MessagingException e) {
            return Mono.error(new RuntimeException(e.getMessage()));
        }

        return Mono.just(code);
    }

    public Mono<Boolean> updateIsUse(EmailVerify emailVerify) {
        if(emailVerify == null || emailVerify.getEmail() == null || emailVerify.getCode() == null) {
            return Mono.error(new RuntimeException("email or code is null"));
        }

        emailVerify.setExpireAt(LocalDateTime.now());

        return Mono.justOrEmpty(emailVerifyMapper.selectByEmailAndCode(emailVerify))
                    .switchIfEmpty(Mono.error(new RuntimeException("email verify not found")))
                    .map(ev -> {
                        ev.setUse(true);
                        return emailVerifyMapper.updateIsUse(ev) > 0;
                    })
                    .onErrorReturn(false);
    }

}
