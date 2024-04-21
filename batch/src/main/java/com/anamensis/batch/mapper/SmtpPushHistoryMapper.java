package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.SmtpPushHistory;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SmtpPushHistoryMapper {

    void save(SmtpPushHistory smtpPushHistory);
}
