package com.anamensis.server.resultMap;

import com.anamensis.server.entity.File;
import com.anamensis.server.entity.Member;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

public class BoardResultMap {
    @Getter
    @Setter
    public static class Board implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private long id;
        private long commentCount;

        private Member member;
        private com.anamensis.server.entity.Board board;
        private File file;
    }

    @Getter
    @Setter
    public static class List {
        private long id;
        private com.anamensis.server.entity.Board board;
        private String writer;
        private String profile;
        private long commentCount;
    }

    @Getter
    @Setter
    public static class Notice {
        private long id;
        private com.anamensis.server.entity.Board board;
        private String writer;
    }
}
