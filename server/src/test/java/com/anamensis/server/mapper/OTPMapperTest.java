package com.anamensis.server.mapper;

import com.anamensis.server.entity.OTP;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OTPMapperTest {

    @SpyBean
    OTPMapper otpMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(OTPMapperTest.class);

    @Test
    void selectByUserId() {
        log.info("{}", otpMapper.selectByUserId("admin"));
    }

    @Test
    void insert() {
        OTP otp = new OTP();
        otp.setHash("hash");
        otp.setCreateAt(LocalDateTime.now());
        otp.setUserPk(2);

        otpMapper.insert(otp);
    }


}