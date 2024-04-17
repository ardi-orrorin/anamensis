package com.anamensis.server.mapper;

import com.anamensis.server.entity.OTP;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface OTPMapper {

    Optional<OTP> selectByUserId(String userId);

    Optional<OTP> selectByUserPk(long userPk);

    int insert(OTP otp);

    int update(OTP otp);

    void disableOTP(long userPk);

    boolean existByUserPk(long userPk);

}
