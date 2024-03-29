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
    private long tableCodePk;
    private long tableRefPk;
    private long userPk;
    private long pointCodePk;
    private LocalDateTime createdAt;
}
