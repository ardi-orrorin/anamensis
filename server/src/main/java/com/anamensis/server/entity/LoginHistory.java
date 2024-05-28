package com.anamensis.server.entity;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
public class LoginHistory {

    private long id;

    private long memberPk;

    private String ip;

    private String location;

    private String device;

    private LocalDateTime createAt;
}
