package com.anamensis.server.dto.response;


import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.BoardResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

public class BoardResponse implements Serializable {

    @Getter
    @Builder
    @Setter
    @ToString
    public static class List implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private long id;

        private long categoryPk;

        private long commentCount;

        private String title;

        private String writer;

        private java.util.List<Object> body;

        private String profileImage;

        private long viewCount;

        private long rate;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;

        private boolean isAdsense;

        private Boolean isPublic;

        private boolean membersOnly;

        private Boolean isBlocked;

        @SneakyThrows
        public static List from(BoardResultMap.Board board) {

            List.ListBuilder builder = List.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .writer(board.getMember().getName())
                    .createdAt(board.getBoard().getCreateAt())
                    .isAdsense(board.getBoard().isAdsense())
                    .commentCount(board.getCommentCount())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .updatedAt(board.getBoard().getUpdateAt())
                    .isPublic(board.getBoard().getIsPublic())
                    .membersOnly(board.getBoard().isMembersOnly())
                    .isBlocked(board.getBoard().isBlocked());

            builder.body(board.getBoard().getContent().getJSONArray("list").toList());

            if (board.getFile().getFilePath() != null) {
                builder.profileImage(board.getFile().getFilePath() + board.getFile().getFileName());
            }
            return builder.build();
        }

        @SneakyThrows
        public static List from(BoardResultMap.List board, Member member) {

            java.util.List<Object> body =
                board.getBoard().isMembersOnly()
                    ? member.getId() > 0 // is login
                        ? board.getBoard().getContent().getJSONArray("list").toList()
                        : java.util.List.of() // not login
                    : board.getBoard().isBlocked()
                        ? java.util.List.of() // blocked
                        : board.getBoard().getContent().getJSONArray("list").toList();

            List.ListBuilder builder = List.builder()
                    .id(board.getBoard().getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .writer(board.getWriter())
                    .createdAt(board.getBoard().getCreateAt())
                    .isAdsense(board.getBoard().isAdsense())
                    .commentCount(board.getCommentCount())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .updatedAt(board.getBoard().getUpdateAt())
                    .isPublic(board.getBoard().getIsPublic())
                    .membersOnly(board.getBoard().isMembersOnly())
                    .profileImage(board.getProfile())
                    .isBlocked(board.getBoard().isBlocked())
                    .body(body);

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

        private String userId;

        private String writer;

        private String profileImage;

        private long viewCount;

        private long rate;

        private Boolean isWriter;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;

        private Boolean isPublic;

        private boolean membersOnly;

        private Boolean isBlocked;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime writerCreatedAt;

        public static Content from(BoardResultMap.Board board, Member member) {
            Content.ContentBuilder builder = Content.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .content(board.getBoard().getContent().toMap())
                    .userId(board.getMember().getUserId())
                    .writer(board.getMember().getName())
                    .viewCount(board.getBoard().getViewCount())
                    .createdAt(board.getBoard().getCreateAt())
                    .updatedAt(board.getBoard().getUpdateAt())
                    .isPublic(board.getBoard().getIsPublic())
                    .membersOnly(board.getBoard().isMembersOnly())
                    .profileImage(board.getFile().getFullPath())
                    .writerCreatedAt(board.getMember().getCreateAt())
                    .isBlocked(board.getBoard().isBlocked());

            if(Objects.nonNull(member)) {
                builder.isWriter(board.getBoard().getMemberPk() == member.getId());
            }

            return builder.build();
        }
    }

    @Getter
    @Builder
    @Setter
    public static class RefContent {
        private long id;

        private String title;

        private Map<String, Object> content;

        private String writer;

        private Boolean isWriter;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;

        private Boolean isPublic;

        private boolean membersOnly;

        private Boolean isBlocked;

        public static RefContent from(BoardResultMap.Board board, Member member) {

            RefContent.RefContentBuilder builder = RefContent.builder()
                .id(board.getId())
                .title(board.getBoard().getTitle())
                .writer(board.getMember().getName())
                .updatedAt(board.getBoard().getUpdateAt())
                .isPublic(board.getBoard().getIsPublic())
                .membersOnly(board.getBoard().isMembersOnly())
                .isBlocked(board.getBoard().isBlocked());

            if (board.getBoard().isBlocked()) {
                return builder.build();
            }

            if(board.getBoard().getIsPublic()) {
                builder.content(board.getBoard().getContent().toMap());
            } else if (Objects.nonNull(member) && board.getBoard().getMemberPk() == member.getId()) {
                builder.isWriter(true);
                builder.content(board.getBoard().getContent().toMap());
            } else if (board.getBoard().isMembersOnly() && member == null) {
                builder.content(board.getBoard().getContent().toMap());
            }

            return builder.build();
        }

    }



    @Getter
    @Builder
    @Setter
    public static class SummaryList implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private long id;
        private long categoryPk;
        private String title;
        private long viewCount;
        private long rate;
        private String createdAt;
        private String updatedAt;

        public static SummaryList from(BoardResultMap.Board board) {
            return SummaryList.builder()
                    .id(board.getId())
                    .title(board.getBoard().getTitle())
                    .viewCount(board.getBoard().getViewCount())
                    .rate(board.getBoard().getRate())
                    .createdAt(board.getBoard().getCreateAt().toString())
                    .updatedAt(board.getBoard().getUpdateAt().toString())
                    .categoryPk(board.getBoard().getCategoryPk())
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class Notice implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private long id;
        private String title;
        private String writer;
        private long viewCount;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        public static Notice from(BoardResultMap.Board board) {
            return Notice.builder()
                .id(board.getId())
                .title(board.getBoard().getTitle())
                .writer(board.getMember().getName())
                .viewCount(board.getBoard().getViewCount())
                .createdAt(board.getBoard().getCreateAt())
                .build();
        }

        public static Notice from(BoardResultMap.Notice notice) {
            return Notice.builder()
                .id(notice.getId())
                .title(notice.getBoard().getTitle())
                .writer(notice.getWriter())
                .viewCount(notice.getBoard().getViewCount())
                .createdAt(notice.getBoard().getCreateAt())
                .build();
        }
    }
}
