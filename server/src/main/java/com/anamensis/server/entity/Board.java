package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@ToString
public class Board {
    private long id;
    private long categoryPk;
    private long userPk;
    private String title;
    private Map<String, Object> content;
    private long rate;
    private long viewCount;
    private LocalDateTime createAt;
    private boolean isAdsense;
    private boolean isUse;
}