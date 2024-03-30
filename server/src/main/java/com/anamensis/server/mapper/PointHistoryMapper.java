package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointHistory;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PointHistoryMapper {
    int insert(PointHistory pointHistory);

    List<PointHistory> selectByPointHistory(PointHistory pointHistory);
}
