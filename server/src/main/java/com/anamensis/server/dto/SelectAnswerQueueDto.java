package com.anamensis.server.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
public class SelectAnswerQueueDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private long boardPk;
    private String boardTitle;
    private long point;

    private String smtpHost;
    private String smtpPort;
    private String smtpUser;
    private String smtpPassword;
}
