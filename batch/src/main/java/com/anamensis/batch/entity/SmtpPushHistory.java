package com.anamensis.batch.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class SmtpPushHistory {
    private long id;
    private long userPk;
    private long userConfigSmtpPk;
    private String subject;
    private String content;
    private String status;
    private String message;
    private LocalDateTime createAt;
}
