package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class Attendance {

    private long memberPk;

    private LocalDate lastDate;

    private int days;

    private boolean isUse;
}
