package com.anamensis.server.resultMap;

import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.ScheduleAlert;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleAlertResultMap {

    private long id;

    private ScheduleAlert scheduleAlert;

    private Board board;
}
