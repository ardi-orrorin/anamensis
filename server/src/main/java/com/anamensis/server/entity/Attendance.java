package com.anamensis.server.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class Attendance {

    private long userPk;

    private LocalDate lastDate;

    private int days;

    private boolean isUse;
}
