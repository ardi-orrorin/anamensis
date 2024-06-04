package com.anamensis.server.dto.response;

import com.anamensis.server.resultMap.BoardCommentResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class BoardCommentResponse {

    @Getter
    @Builder
    public static class Comment {

        private long id;

        private Integer blockSeq;

        private String content;

        private String writer;

        private String profileImage;

        private Long parentPk;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        public static Comment fromResultMap(BoardCommentResultMap.BoardComment resultMap) {


            return Comment.builder()
                    .id(resultMap.getId())
                    .content(resultMap.getBoardComment().getContent())
                    .writer(resultMap.getBoardComment().getUserId())
                    .profileImage(resultMap.getFile().getFilePath() + resultMap.getFile().getFileName())
                    .parentPk(resultMap.getBoardComment().getParentPk())
                    .blockSeq(resultMap.getBoardComment().getBlockSeq())
                    .createdAt(resultMap.getBoardComment().getCreateAt())
                    .build();
        }

    }
}
