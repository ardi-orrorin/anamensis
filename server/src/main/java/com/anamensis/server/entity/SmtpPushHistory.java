package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class SmtpPushHistory {

    private long id;

    private String fromMail;

    private String toMail;

    private String subject;

    private String content;

    private String status;

    private String message;

    private LocalDateTime createdAt;
}
