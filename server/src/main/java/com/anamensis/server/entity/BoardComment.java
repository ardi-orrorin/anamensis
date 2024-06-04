package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class BoardComment {
    private long id;
    private long boardPk;
    private Long parentPk;
    private String userId;
    private String content;
    private LocalDateTime createAt;
    private boolean isUse;

}
