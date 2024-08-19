package com.anamensis.server.dto.request;

import com.anamensis.server.entity.BoardBlockHistory;
import com.anamensis.server.entity.BoardBlockResultStatus;
import com.anamensis.server.entity.BoardBlockStatus;
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
            boardBlockHistory.setMemberId(memberPk);
            boardBlockHistory.setCreatedAt(LocalDateTime.now());
            boardBlockHistory.setStatus(BoardBlockStatus.STARTED);
            return boardBlockHistory;
        }
    }

    @Getter
    @Setter
    public static class Update {
        private long id;
        private String answer;
        private String result;
        private BoardBlockResultStatus resultStatus;

        public BoardBlockHistory toEntity() {
            BoardBlockHistory boardBlockHistory = new BoardBlockHistory();
            boardBlockHistory.setId(id);
            boardBlockHistory.setResultStatus(resultStatus);

            if(answer != null && !answer.isEmpty()) {
                boardBlockHistory.setAnswer(answer);
                boardBlockHistory.setAnswerAt(LocalDateTime.now());
                boardBlockHistory.setStatus(BoardBlockStatus.ANSWERED);
            }

            if(result != null && !result.isEmpty()) {
                boardBlockHistory.setResult(result);
                boardBlockHistory.setResultAt(LocalDateTime.now());
                boardBlockHistory.setStatus(BoardBlockStatus.RESULTED);
            }

            return boardBlockHistory;
        }

        public void setResultStatus(String resultStatus) {
            if(resultStatus == null || resultStatus.isEmpty()) {
                return;
            }

            this.resultStatus = BoardBlockResultStatus.valueOf(resultStatus);
        }
    }
}
