package com.anamensis.server.dto.response;


import com.anamensis.server.resultMap.BoardResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;

public class BoardResponse {

    @Getter
    @Builder
    @ToString
    @Slf4j
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
            List.ListBuilder builder = List.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .writer(board.getUser().getName())
                    .createdAt(board.getBoard().getCreateAt())
                    .isAdsense(board.getBoard().isAdsense());

            if (board.getFile().getFilePath() != null) {
                builder.profileImage(board.getFile().getFilePath() + board.getFile().getFileName());
            }
            return builder.build();
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
            Content.ContentBuilder builder = Content.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .content(board.getBoard().getContent())
                    .writer(board.getUser().getName())
                    .createdAt(board.getBoard().getCreateAt());

            if (board.getFile().getFilePath() != null) {
                builder.profileImage(board.getFile().getFilePath() + board.getFile().getFileName());
            }

            return builder.build();
        }
    }
}
