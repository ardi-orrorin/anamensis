package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.ScheduleAlert;
import com.anamensis.server.resultMap.ScheduleAlertResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleAlertMapper {

    List<ScheduleAlertResultMap> findAllByUserId(
        @Param("page") Page page,
        @Param("userId") String userId
    );

    List<ScheduleAlert> findAllByBoardId(
        String userId,
        long boardId
    );

    int save(ScheduleAlert scheduleAlert);

    int saveAll(List<ScheduleAlert> list);

    int delete(long id);

    int update(ScheduleAlert nextSchAlert);
}
