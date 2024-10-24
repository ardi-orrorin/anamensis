package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class PointHistory {
    private long id;
    private long tableCodePk;
    private long tableRefPk;
    private long memberPk;
    private long pointCodePk;
    private long value = 0L;
    private LocalDateTime createdAt;
}
