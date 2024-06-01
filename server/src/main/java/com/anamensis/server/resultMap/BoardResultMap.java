package com.anamensis.server.resultMap;

import com.anamensis.server.entity.File;
import com.anamensis.server.entity.Member;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class BoardResultMap {

    @Getter
    @Setter
    @ToString
    public static class Board {
        private long id;
        private Member member;
        private com.anamensis.server.entity.Board board;
        private File file;
    }
}
