package com.anamensis.server.entity;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class OTP {

    private long id;

    private long memberPk;

    private String hash;

    private LocalDateTime createAt;

    private boolean isUse;
}
