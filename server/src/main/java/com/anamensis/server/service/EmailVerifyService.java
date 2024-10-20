package com.anamensis.server.service;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.mapper.EmailVerifyMapper;
import com.anamensis.server.provider.EmailVerifyProvider;
import com.anamensis.server.provider.MailProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerifyService {

    private final EmailVerifyMapper emailVerifyMapper;

    private final EmailVerifyProvider emailVerifyProvider;

    private final MailProvider mailProvider;

    private final Set<SystemSetting> systemSettings;


    public Mono<String> insert(EmailVerify emailVerify) {
        if (emailVerify == null || emailVerify.getEmail() == null) {
            return Mono.error(new RuntimeException("email is null"));
        }

        String code = emailVerifyProvider.generateCode();

        emailVerify.setCode(code);
        emailVerify.setCreateAt(LocalDateTime.now());
        emailVerify.setExpireAt(LocalDateTime.now().plusMinutes(10));

        emailVerifyMapper.updateDisableByEmail(emailVerify.getEmail());


        int result = emailVerifyMapper.insert(emailVerify);
        if (result == 0) return Mono.error(new RuntimeException("insert failed"));

        SystemSetting smtp = systemSettings.stream()
                .filter(s -> s.getKey() == SystemSettingKey.SMTP)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("smtp not found"));

        if(!smtp.getValue().getBoolean("enabled")) {
            return Mono.error(new RuntimeException("smtp not enabled"));
        }

        MailProvider.MailMessage mailMessage = new MailProvider.MailMessage(
            emailVerify.getEmail(),
            "Anamensis Email Verify",
            "Your verify code is " + code
        );

        return mailProvider.sendMessage(mailMessage)
            .flatMap(success -> {
                if(!success) {
                    return Mono.error(new RuntimeException("send email failed"));
                }
                return Mono.just(code);
            });
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
