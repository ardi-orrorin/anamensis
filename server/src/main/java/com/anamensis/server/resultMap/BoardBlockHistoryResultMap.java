package com.anamensis.server.resultMap;

import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.BoardBlockHistory;
import lombok.Getter;
import lombok.Setter;

public class BoardBlockHistoryResultMap {

    @Getter
    @Setter
    public static class ResultMap {
        private long id;

        private BoardBlockHistory boardBlockHistory;

        private Board board;
    }
}
