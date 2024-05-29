package com.anamensis.server.dto.response;


import com.anamensis.server.resultMap.BoardResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

public class BoardResponse {

    @Getter
    @Builder
    @Setter
    public static class List {

        private long id;

        private String title;

        private String writer;

        private String profileImage;

        private long viewCount;

        private long rate;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        private boolean isAdsense;

        public static List from(BoardResultMap.Board board) {
            List.ListBuilder builder = List.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .writer(board.getMember().getName())
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
    @Setter
    public static class Content {

        private long id;

        private String title;

        private long categoryPk;

        private Map<String, Object> content;

        private String writer;

        private String profileImage;

        private long viewCount;

        private long rate;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        public static Content from(BoardResultMap.Board board) {
            Content.ContentBuilder builder = Content.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .content(board.getBoard().getContent())
                    .writer(board.getMember().getName())
                    .viewCount(board.getBoard().getViewCount())
                    .createdAt(board.getBoard().getCreateAt());

            if (board.getFile().getFilePath() != null) {
                builder.profileImage(board.getFile().getFilePath() + board.getFile().getFileName());
            }

            return builder.build();
        }
    }

    @Getter
    @Builder
    @Setter
    public static class SummaryList {
        private long id;
        private String title;
        private long viewCount;
        private long rate;
        private String createdAt;

        public static SummaryList from(BoardResultMap.Board board) {
            return SummaryList.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .rate(board.getBoard().getRate())
                    .createdAt(board.getBoard().getCreateAt().toString())
                    .build();
        }
    }
}
