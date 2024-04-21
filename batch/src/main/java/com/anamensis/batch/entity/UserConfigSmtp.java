package com.anamensis.batch.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class UserConfigSmtp {

    private long id;

    private long userPk;

    private String host;

    private String port;

    private String username;

    private String password;

    private String fromEmail;

    private String fromName;

    private Boolean useSSL;

    private Boolean isUse;

    private Boolean isDefault;
}
