package com.anamensis.server.otp;


import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Base64;

@SpringBootTest
public class OTP {

    Logger log = org.slf4j.LoggerFactory.getLogger(OTP.class);

    @Test
    void name() {

//        TotpAuth totpAuth = TotpAuth.create();
//        SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//        Base64.Encoder encoder = Base64.getEncoder();
//        OtpKey otpKey = new OtpKey();
//        otpKey.setAlgorithm("SHA512");
//        otpKey.setKey(encoder.encodeToString(secret.getEncoded()));
//        String scret = totpAuth.generateUri(otpKey, "isUser", "user");
//        System.out.println(scret);
//
//        OtpCredentials otpCredentials =
//                new OtpCredentials(encoder.encodeToString(secret.getEncoded()), "SHA512");


        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        GoogleAuthenticatorKey key = gAuth.createCredentials();

        System.out.println("Verification code is: " + key.getVerificationCode());

        String qrcode = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL("amanesis","test", key);

        System.out.println("qrcode: " + qrcode);

        System.out.println("Is valid: " + gAuth.authorize(key.getKey(), 123456));

    }
}
