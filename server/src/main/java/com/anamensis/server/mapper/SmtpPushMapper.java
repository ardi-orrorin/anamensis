package com.anamensis.server.mapper;


import com.anamensis.server.entity.SmtpPush;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SmtpPushMapper {
    void save(SmtpPush smtpPush);
}
