package com.anamensis.server.mapper;

import com.anamensis.server.entity.EmailVerify;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface EmailVerifyMapper {

    Optional<EmailVerify> selectByEmailAndCode(EmailVerify emailVerify);
    int insert(EmailVerify emailVerify);

    int updateIsUse(EmailVerify emailVerify);
}
