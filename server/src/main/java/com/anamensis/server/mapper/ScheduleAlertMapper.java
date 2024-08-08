package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.ScheduleAlert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleAlertMapper {

    List<ScheduleAlert> findAllByUserId(
        @Param("page") Page page,
        @Param("userId") String userId
    );

    int save(ScheduleAlert scheduleAlert);

}
