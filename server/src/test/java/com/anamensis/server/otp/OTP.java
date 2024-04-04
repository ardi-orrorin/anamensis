package com.anamensis.server.otp;


import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.vertx.ext.auth.otp.OtpCredentials;
import io.vertx.ext.auth.otp.OtpKey;
import io.vertx.ext.auth.otp.totp.TotpAuth;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.crypto.SecretKey;
import java.util.Base64;

@SpringBootTest
public class OTP {

    @Test
    void name() throws Exception {

        TotpAuth totpAuth = TotpAuth.create();
        SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        Base64.Encoder encoder = Base64.getEncoder();
        OtpKey otpKey = new OtpKey();
        otpKey.setAlgorithm("SHA512");
        otpKey.setKey(encoder.encodeToString(secret.getEncoded()));
        String scret = totpAuth.generateUri(otpKey, "isUser", "user");
        System.out.println(scret);

        OtpCredentials otpCredentials =
                new OtpCredentials(encoder.encodeToString(secret.getEncoded()), "SHA512");
        otpCredentials.checkValid("123456");

    }
}
