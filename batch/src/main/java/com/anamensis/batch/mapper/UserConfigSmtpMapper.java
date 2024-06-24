package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.MemberConfigSmtp;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserConfigSmtpMapper {

    List<MemberConfigSmtp> findAll();

    List<MemberConfigSmtp> findByIds(List<String> ids);
}
