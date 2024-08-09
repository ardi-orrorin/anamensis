package com.anamensis.server.mapper;

import com.anamensis.server.entity.ScheduleAlert;
import com.anamensis.server.resultMap.ScheduleAlertResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleAlertMapper {

    List<ScheduleAlertResultMap> findAllByUserId(String userId);

    List<ScheduleAlert> findAllByBoardId(
        String userId,
        long boardId
    );

    int save(ScheduleAlert scheduleAlert);

    int saveAll(List<ScheduleAlert> list);

    int updateIsRead(long id, String userId);

    int update(ScheduleAlert nextSchAlert);

    int delete(long id);
}
