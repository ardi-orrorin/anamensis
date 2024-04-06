package com.anamensis.server.service;

import com.anamensis.server.entity.EmailVerify;
import com.anamensis.server.mapper.EmailVerifyMapper;
import com.anamensis.server.provider.EmailVerifyProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerifyService {

    private final EmailVerifyMapper emailVerifyMapper;

    private final EmailVerifyProvider emailVerifyProvider;

    @Transactional
    public String insert(EmailVerify emailVerify) {
        String code = emailVerifyProvider.generateCode();

        emailVerify.setCode(code);
        emailVerify.setCreateAt(LocalDateTime.now());
        emailVerify.setExpireAt(LocalDateTime.now().plusMinutes(10));

        int result = emailVerifyMapper.insert(emailVerify);

        if(result == 0) throw new RuntimeException("insert failed");

        return code;
    }

    @Transactional
    public boolean updateIsUse(EmailVerify emailVerify) {
        emailVerify.setExpireAt(LocalDateTime.now());
        EmailVerify email = emailVerifyMapper.selectByEmailAndCode(emailVerify)
                .orElseThrow(() -> new RuntimeException("not found"));;

        email.setUse(false);

        int result = emailVerifyMapper.updateIsUse(email);

        return result == 1;
    }

}
