package com.anamensis.server.service;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.mapper.EmailVerifyMapper;
import com.anamensis.server.provider.AwsSesMailProvider;
import com.anamensis.server.provider.EmailVerifyProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.io.OutputStream;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerifyService {

    private final EmailVerifyMapper emailVerifyMapper;

    private final EmailVerifyProvider emailVerifyProvider;

    private final AwsSesMailProvider awsSesMailProvider;

    @Transactional
    public Mono<String> insert(EmailVerify emailVerify) {
        String code = emailVerifyProvider.generateCode();

        emailVerify.setCode(code);
        emailVerify.setCreateAt(LocalDateTime.now());
        emailVerify.setExpireAt(LocalDateTime.now().plusMinutes(10));

        int result = emailVerifyMapper.insert(emailVerify);

        if(result == 0) throw new RuntimeException("insert failed");

        try {
            awsSesMailProvider.verifyEmail(code, emailVerify.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("send email failed");
        }

        return Mono.just(code);
    }

    @Transactional
    public Mono<Boolean> updateIsUse(EmailVerify emailVerify) {
        emailVerify.setExpireAt(LocalDateTime.now());

        System.out.println(emailVerify);

        EmailVerify email = emailVerifyMapper.selectByEmailAndCode(emailVerify)
                .orElseThrow(() -> new RuntimeException("not found"));;

        email.setUse(false);

        int result = emailVerifyMapper.updateIsUse(email);

        return Mono.just(result == 1);
    }

}
