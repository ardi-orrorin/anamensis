package com.anamensis.server.resultMap;


import com.anamensis.server.entity.PointCode;
import com.anamensis.server.entity.PointHistory;
import com.anamensis.server.entity.TableCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PointHistoryResultMap {
    private long id;
    private PointHistory pointHistory;
    private PointCode pointCode;
    private TableCode tableCode;
}
