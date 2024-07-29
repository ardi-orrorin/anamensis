package com.anamensis.server.dto.request;

import com.anamensis.server.entity.BoardBlockHistory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class BoardBlockHistoryRequest {

    @Getter
    @Setter
    public static class Save {
        private long boardPk;
        private long memberPk;
        private String reason;

        public BoardBlockHistory toEntity() {
            BoardBlockHistory boardBlockHistory = new BoardBlockHistory();
            boardBlockHistory.setBoardId(boardPk);
            boardBlockHistory.setReason(reason);
            boardBlockHistory.setCreatedAt(LocalDateTime.now());
            return boardBlockHistory;
        }
    }

    @Getter
    @Setter
    public static class Update {
        private long id;
        private String answer;
        private String result;

        public BoardBlockHistory toEntity() {
            BoardBlockHistory boardBlockHistory = new BoardBlockHistory();
            boardBlockHistory.setId(id);

            if(answer != null && !answer.isEmpty()) {
                boardBlockHistory.setAnswer(answer);
                boardBlockHistory.setAnswerAt(LocalDateTime.now());
            }
            if(result != null && !result.isEmpty()) {
                boardBlockHistory.setResult(result);
                boardBlockHistory.setResultAt(LocalDateTime.now());
            }

            return boardBlockHistory;
        }
    }
}
