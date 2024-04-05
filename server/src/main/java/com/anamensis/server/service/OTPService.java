package com.anamensis.server.service;

import com.anamensis.server.entity.OTP;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.OTPMapper;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final OTPMapper otpMapper;

    private final GoogleAuthenticator gAuth;

    public OTP selectByUserId(String userId) {
        return otpMapper.selectByUserId(userId).orElseThrow(() ->
                new RuntimeException("not found")
        );
    }

    public Optional<OTP> selectByUserPk(long userPk) {
        return otpMapper.selectByUserPk(userPk);
    }

    public String insert(User user) {
        GoogleAuthenticatorKey key = gAuth.createCredentials();

        OTP otp = new OTP();
        otp.setUserPk(user.getId());
        otp.setHash(key.getKey());
        otp.setCreateAt(LocalDateTime.now());

        int result = otpMapper.insert(otp);

        if(result != 1) {
            throw new RuntimeException("insert fail");
        }

        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("Anamensis", user.getUserId(), key);
    }

    public boolean update(OTP otp) {
        otp.setUse(false);
        int result = otpMapper.update(otp);
        return result == 1;
    }

    public boolean verify(Tuple2<OTP, Integer> tuple) {
        return gAuth.authorize(tuple.getT1().getHash(), tuple.getT2());
    }

}
