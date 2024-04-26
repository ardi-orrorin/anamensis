package com.anamensis.server.mapper;

import com.anamensis.server.entity.SmtpPushHistory;
import com.anamensis.server.resultMap.SmtpPushHistoryResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface SmtpPushHistoryMapper {
    long countByUserPk(long userPk);

    List<SmtpPushHistoryResultMap.ListSmtpPushHistory> findByUserPk(long userPk);

    Optional<SmtpPushHistory> findById(long id);


}
