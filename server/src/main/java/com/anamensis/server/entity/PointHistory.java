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
public class PointHistory {
    private long id;
    private String tableName;
    private long tablePk;
    private long userPk;
    private long pointCodePk;
    private LocalDateTime createAt;
}
