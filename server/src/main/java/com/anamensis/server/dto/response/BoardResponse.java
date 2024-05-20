package com.anamensis.server.dto.response;


import com.anamensis.server.resultMap.BoardResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Map;

public class BoardResponse {

    @Getter
    @Builder
    @ToString
    public static class List {

        private long id;

        private String title;

        private String writer;

        private String profileImage;

        private long viewCount;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        private boolean isAdsense;

        public static List from(BoardResultMap.Board board) {
            return List.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .writer(board.getUser().getName())
                    .profileImage(board.getFile().getFilePath() + board.getFile().getFileName())
                    .createdAt(board.getBoard().getCreateAt())
                    .isAdsense(board.getBoard().isAdsense())
                    .build();
        }
    }

    @Getter
    @Builder
    @ToString
    public static class Content {

        private long id;

        private String title;

        private long categoryPk;

        private Map<String, Object> content;

        private String writer;

        private String profileImage;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        public static Content from(BoardResultMap.Board board) {
            return Content.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .content(board.getBoard().getContent())
                    .writer(board.getUser().getName())
                    .profileImage(board.getFile().getFilePath() + board.getFile().getFileName())
                    .createdAt(board.getBoard().getCreateAt())
                    .build();
        }
    }
}
