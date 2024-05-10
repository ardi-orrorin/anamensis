package com.anamensis.server.resultMap;

import com.anamensis.server.entity.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class BoardResultMap {

    @Getter
    @Setter
    @ToString
    public static class Board {
        private long id;
        private User user;
        private com.anamensis.server.entity.Board board;
    }
}
