package com.anamensis.batch.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class SelectAnswerQueueDto implements Serializable {
    private long boardPk;
    private String boardTitle;
    private long point;

    private String smtpHost;
    private String smtpPort;
    private String smtpUser;
    private String smtpPassword;
}
