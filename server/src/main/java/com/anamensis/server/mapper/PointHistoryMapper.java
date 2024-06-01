package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.PointHistoryRequest;
import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.resultMap.PointHistoryResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PointHistoryMapper {
    int insert(PointHistory pointHistory);

    List<PointHistoryResultMap> selectByPointHistory(
        @Param("page") Page page,
        @Param("param") PointHistoryRequest.Param param
    );
}
