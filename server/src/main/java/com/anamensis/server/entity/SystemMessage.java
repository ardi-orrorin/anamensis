package com.anamensis.server.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class SystemMessage {

    private int id;

    private String webSysPk;

    private String subject;

    private String content;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private boolean isUse;

    private String extra1;

    private String extra2;

    private String extra3;

    private String extra4;

    private String extra5;

}
