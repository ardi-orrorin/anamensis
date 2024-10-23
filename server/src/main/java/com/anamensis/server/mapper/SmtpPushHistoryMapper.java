package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.SmtpPushHistory;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface SmtpPushHistoryMapper {

    long count();

    List<SmtpPushHistory> findAll(Page page);

    Optional<SmtpPushHistory> findById(long id);


}
