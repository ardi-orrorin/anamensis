package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.UserConfigSmtp;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserConfigSmtpMapper {

    List<UserConfigSmtp> findAll();

    List<UserConfigSmtp> findByIds(List<String> ids);
}
