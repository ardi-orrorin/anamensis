package com.anamensis.server.dto.request;

import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.BoardComment;
import com.anamensis.server.entity.Member;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

public class BoardCommentRequest {


    @Getter
    @Setter
    public static class Save {

        @NotNull
        private Long boardPk;

        private Integer blockSeq;

        private Long parentPk;

        @NotNull
        private String content;

        public static BoardComment toEntity(Save save, UserDetails member) {
            BoardComment bc = new BoardComment();
            bc.setBoardPk(save.getBoardPk());
            bc.setParentPk(save.getParentPk());
            bc.setContent(save.getContent());
            bc.setUserId(member.getUsername());
            bc.setBlockSeq(save.getBlockSeq());
            bc.setCreateAt(LocalDateTime.now());
            return bc;
        }
    }
}
