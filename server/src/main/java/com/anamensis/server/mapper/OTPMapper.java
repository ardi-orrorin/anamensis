package com.anamensis.server.mapper;

import com.anamensis.server.entity.OTP;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface OTPMapper {

    Optional<OTP> selectByUserId(String userId);

    Optional<OTP> selectByMemberPk(long memberPk);

    int insert(OTP otp);

    int updateIsUse(OTP otp);

    int disableOTP(long memberPk);

    boolean existByMemberPk(long memberPk);

}
