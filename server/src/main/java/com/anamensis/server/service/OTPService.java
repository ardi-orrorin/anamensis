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
@Transactional
public class OTPService {

    private final OTPMapper otpMapper;

    private final GoogleAuthenticator gAuth;

    public Mono<OTP> selectByUserId(String userId) {
        return Mono.justOrEmpty(otpMapper.selectByUserId(userId))
                   .switchIfEmpty(Mono.error(new RuntimeException("not found")));
    }

    public Mono<OTP> selectByMemberPk(long memberPk) {
        return Mono.justOrEmpty(otpMapper.selectByMemberPk(memberPk))
                   .switchIfEmpty(Mono.error(new RuntimeException("not found")));

    }

    public Mono<String> insert(Member member) {
        if(member == null) return Mono.error(new RuntimeException("member is null"));
        if(member.getId() == 0) return Mono.error(new RuntimeException("member id is null"));

        GoogleAuthenticatorKey key = gAuth.createCredentials();

        OTP otp = new OTP();
        otp.setMemberPk(member.getId());
        otp.setHash(key.getKey());
        otp.setCreateAt(LocalDateTime.now());

        String url = GoogleAuthenticatorQRGenerator.getOtpAuthURL("Anamensis", member.getUserId(), key);

        Mono<Integer> disableOTP = Mono.fromCallable(()-> otpMapper.disableOTP(member.getId()));
        Mono<Integer> insert = Mono.fromCallable(() -> otpMapper.insert(otp));

        return Mono.zip(disableOTP, insert)
                     .onErrorMap(e -> new RuntimeException("otp insert failed"))
                     .flatMap(t -> t.getT2() > 0
                             ? Mono.just(url)
                             : Mono.error(new RuntimeException("otp insert failed"))
                     );

    }

    public Mono<Boolean> update(OTP otp) {
        if(otp == null) return Mono.error(new RuntimeException("otp is null"));
        if(otp.getHash() == null) return Mono.error(new RuntimeException("otp hash is null"));

        otp.setUse(false);

        return Mono.fromCallable(() ->  otpMapper.updateIsUse(otp) > 0)
                .onErrorReturn(false);

    }
    public Mono<Boolean> disableOTP(long memberPk) {
        return Mono.fromCallable(() -> otpMapper.disableOTP(memberPk) > 0)
                .onErrorReturn(false);
    }

    public Mono<Boolean> existByMemberPk(long memberPk) {
        return Mono.fromCallable(() -> otpMapper.existByMemberPk(memberPk));
    }

    public Mono<Boolean> verify(String hash, int code) {
        return Mono.fromCallable(() -> gAuth.authorize(hash, code));
    }

}
