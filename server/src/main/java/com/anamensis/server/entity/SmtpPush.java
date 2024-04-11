package com.anamensis.server.entity;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SmtpPush {

    private long id;

    private long userPk;

    private long userConfigSmtpPk;

    private String subject;

    private String content;

    private LocalDateTime createAt;
}
