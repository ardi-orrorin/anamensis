package com.anamensis.server.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class MemberConfigSmtp {

    private long id;

    private long memberPk;

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
