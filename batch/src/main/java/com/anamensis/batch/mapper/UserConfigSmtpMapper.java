package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.UserConfigSmtp;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserConfigSmtpMapper {

    List<UserConfigSmtp> findAll();
}
