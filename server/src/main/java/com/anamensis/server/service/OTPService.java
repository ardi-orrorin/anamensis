package com.anamensis.server.service;

import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.OTP;
import com.anamensis.server.mapper.OTPMapper;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final OTPMapper otpMapper;

    private final GoogleAuthenticator gAuth;

    public Mono<OTP> selectByUserId(String userId) {
        return Mono.justOrEmpty(otpMapper.selectByUserId(userId))
                   .switchIfEmpty(Mono.error(new RuntimeException("not found")));
    }

    public Mono<OTP> selectByUserPk(long userPk) {
        return Mono.justOrEmpty(otpMapper.selectByMemberPk(userPk));
    }

    @Transactional
    public Mono<String> insert(Member users) {
        GoogleAuthenticatorKey key = gAuth.createCredentials();

        OTP otp = new OTP();
        otp.setMemberPk(users.getId());
        otp.setHash(key.getKey());
        otp.setCreateAt(LocalDateTime.now());

        int result = otpMapper.insert(otp);

        if(result != 1) {
            throw new RuntimeException("insert fail");
        }

        String url = GoogleAuthenticatorQRGenerator.getOtpAuthURL("Anamensis", users.getUserId(), key);

        return Mono.just(url);
    }

    @Transactional
    public Mono<Boolean> update(OTP otp) {
        otp.setUse(false);
        int result = otpMapper.updateIsUse(otp);
        return Mono.just(result == 1);
    }


    @Transactional
    public Mono<Tuple2<Long, Boolean>> disableOTP(long userPk) {
        otpMapper.disableOTP(userPk);

        return Mono.zip(Mono.just(userPk), Mono.just(true));
    }

    public Mono<Boolean> existByUserPk(long userPk) {
        return Mono.just(otpMapper.existByMemberPk(userPk));
    }

    @Transactional
    public Mono<Tuple2<OTP, Boolean>> verify(Tuple2<OTP, Integer> tuple) {
        return Mono.just(tuple.mapT2(otp ->
                gAuth.authorize(tuple.getT1().getHash(), tuple.getT2())));
    }

}
