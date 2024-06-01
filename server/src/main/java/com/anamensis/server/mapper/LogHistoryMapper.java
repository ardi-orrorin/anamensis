package com.anamensis.server.mapper;

import com.anamensis.server.entity.LogHistory;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogHistoryMapper {

    void save(LogHistory logHistory);
}
