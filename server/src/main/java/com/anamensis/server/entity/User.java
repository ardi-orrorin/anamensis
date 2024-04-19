package com.anamensis.server.entity;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;


@Getter
@Setter
@ToString
@Builder
public class User{

    private long id;

    private String userId;

    private String pwd;

    private String name;

    private String email;

    private String phone;

    private long point;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private boolean isUse;

    private Boolean sAuth;

    private AuthType sAuthType;
}
