package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.SmtpPushHistory;
import com.anamensis.server.resultMap.SmtpPushHistoryResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface SmtpPushHistoryMapper {
    long countByUserPk(long userPk);

    List<SmtpPushHistoryResultMap.ListSmtpPushHistory> findByUserPk(
        @Param("userPk") long userPk,
        @Param("page") Page page
    );

    Optional<SmtpPushHistory> findById(long id);


}
