package com.anamensis.server.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class PointHistoryRequest {

    @Getter
    @Setter
    @ToString
    public static class Param {
        private long id;
        private String pointCodeName;
        private String tableName ;
    }
}
