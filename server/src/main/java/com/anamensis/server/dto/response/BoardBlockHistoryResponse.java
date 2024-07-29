package com.anamensis.server.dto.response;

import com.anamensis.server.resultMap.BoardBlockHistoryResultMap;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.format.DateTimeFormatter;

public class BoardBlockHistoryResponse {

    @Getter
    @Setter
    public static class List implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private long id;

        private long boardPk;

        private String title;

        private String createdAt;
        private String answerAt;
        private String resultAt;

        public static List from(BoardBlockHistoryResultMap.ResultMap resultMap) {
            List list = new List();

            list.setId(resultMap.getId());
            list.setBoardPk(resultMap.getBoard().getId());
            list.setTitle(resultMap.getBoard().getTitle());
            list.setCreatedAt(resultMap.getBoardBlockHistory().getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

            if(resultMap.getBoardBlockHistory().getAnswerAt() != null) {
                list.setAnswerAt(resultMap.getBoardBlockHistory().getAnswerAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }

            if(resultMap.getBoardBlockHistory().getResultAt() != null) {
                list.setResultAt(resultMap.getBoardBlockHistory().getResultAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }

            return list;
        }
    }

    @Getter
    @Setter
    public static class Detail implements Serializable {

        @Serial
        private static final long serialVersionUID = 1L;

        private long id;

        private long boardPk;

        private String title;

        private String reason;

        private String answer;

        private String createdAt;
        private String answerAt;
        private String resultAt;

        public static Detail from(BoardBlockHistoryResultMap.ResultMap resultMap) {
            Detail detail = new Detail();

            detail.setId(resultMap.getId());
            detail.setBoardPk(resultMap.getBoard().getId());
            detail.setTitle(resultMap.getBoard().getTitle());
            detail.setCreatedAt(resultMap.getBoardBlockHistory().getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

            if(resultMap.getBoardBlockHistory().getAnswer() != null) {
                detail.setAnswer(resultMap.getBoardBlockHistory().getAnswer());
            }

            if(resultMap.getBoardBlockHistory().getReason() != null) {
                detail.setReason(resultMap.getBoardBlockHistory().getReason());
            }

            if(resultMap.getBoardBlockHistory().getAnswerAt() != null) {
                detail.setAnswerAt(resultMap.getBoardBlockHistory().getAnswerAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }

            if(resultMap.getBoardBlockHistory().getResultAt() != null) {
                detail.setResultAt(resultMap.getBoardBlockHistory().getResultAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }

            return detail;
        }
    }
}
