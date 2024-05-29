package com.anamensis.server.dto.request;

import lombok.Getter;
import lombok.Setter;

public class PointHistoryRequest {

    @Getter
    @Setter
    public static class Param {
        private long id;
        private long tableRefPk;
        private long memberPk;
        private String pointCodeName;
        private String tableName ;
    }
}
