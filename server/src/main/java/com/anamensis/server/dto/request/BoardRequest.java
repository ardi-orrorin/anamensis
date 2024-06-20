package com.anamensis.server.dto.request;

import com.anamensis.server.entity.Board;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

public class BoardRequest {

    @Getter
    @Setter
    public static class Params {
        private String type;
        private String value;
        private long categoryPk;
        private Boolean isSelf;
    }

    @Getter
    @Setter
    public static class Create {
        private long id;
        private long categoryPk;
        private long memberPk;
        private String title;
        private Map<String, Object> content;
        private long rate;
        private long viewCount;
        private LocalDateTime createAt;
        private LocalDateTime updateAt;
        private boolean isAdsense;
        private boolean isUse;
        private long[] uploadFiles;
        private String[] removeFiles;
        private Boolean isPublic = false;
        private String searchText;

        public Board toEntity() {
            Board board = new Board();
            board.setId(id);
            board.setCategoryPk(categoryPk);
            board.setMemberPk(memberPk);
            board.setTitle(title);
            board.setContent(content);
            board.setRate(rate);
            board.setViewCount(viewCount);
            board.setCreateAt(createAt);
            board.setUpdateAt(updateAt);
            board.setAdsense(isAdsense);
            board.setUse(isUse);
            board.setIsPublic(isPublic);
            return board;
        }
    }
}
