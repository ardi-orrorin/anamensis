package com.anamensis.server.resultMap;

import com.anamensis.server.entity.File;
import com.anamensis.server.entity.Member;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class BoardCommentResultMap {

    @Getter
    @Setter
    @ToString
    public static class BoardComment {
        private long id;
        private Member member;
        private com.anamensis.server.entity.BoardComment boardComment;
        private File file;
    }

    @Getter
    @Setter
    @ToString
    public static class List {
        private long id;
        private com.anamensis.server.entity.BoardComment boardComment;
        private String profile;
    }

}
