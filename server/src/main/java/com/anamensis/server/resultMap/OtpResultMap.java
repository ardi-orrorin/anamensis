package com.anamensis.server.resultMap;

import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.OTP;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OtpResultMap {

    private long id;

    private OTP otp;

    private Member member;
}
