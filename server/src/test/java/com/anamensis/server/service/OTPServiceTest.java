package com.anamensis.server.service;

import com.anamensis.server.entity.OTP;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.OTPMapper;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OTPServiceTest {

    @SpyBean
    OTPService otpService;

    @SpyBean
    OTPMapper otpMapper;

    @SpyBean
    UserService userService;

    @SpyBean
    GoogleAuthenticator gAuth;

    Logger log = org.slf4j.LoggerFactory.getLogger(OTPServiceTest.class);

    @Test
    void insert() {
        User user = userService.findUserByUserId("admin");
//        otpService.insert(user.getId());


        insertTest(user);
    }

    @Test
    void selectByUserId() {
        otpService.selectByUserId("admin");
    }

    @Test
    void selectByUserIdTest(String userId) {
//        String user = "admin";
        otpMapper.selectByUserId(userId).orElseThrow(() ->
                new RuntimeException("not found")
        );
    }

    @Test
    void insertTest(User user) {
//        long userPk = 2;
        GoogleAuthenticatorKey key = gAuth.createCredentials();

        OTP otp = new OTP();
        otp.setUserPk(user.getId());
        otp.setHash(key.getKey());
        otp.setCreateAt(LocalDateTime.now());

        int result = otpMapper.insert(otp);

        if(result != 1){
            throw new RuntimeException("insert fail");
        }

        GoogleAuthenticatorQRGenerator qrGenerator = new GoogleAuthenticatorQRGenerator();
        String url = qrGenerator.getOtpAuthURL("Anamensis", user.getUserId() , key);

        log.info("url: {}", url);

    }

    @Test
    void verify(Tuple2<OTP, Integer> tuple) {
        gAuth.authorize(tuple.getT1().getHash(), tuple.getT2());
    }
}