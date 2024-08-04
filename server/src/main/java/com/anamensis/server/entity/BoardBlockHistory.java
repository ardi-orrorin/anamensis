package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class BoardBlockHistory {

    private long id;
    private long boardId;
    private long memberId;

    private BoardBlockStatus status;

    private String title;
    private String reason;
    private String answer;
    private String result;

    private BoardBlockResultStatus resultStatus;

    private LocalDateTime createdAt;
    private LocalDateTime answerAt;
    private LocalDateTime resultAt;

}