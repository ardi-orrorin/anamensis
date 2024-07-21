package com.anamensis.server.entity;

import com.anamensis.server.dto.SerializedJSONObject;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class Board implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private long id;
    private long categoryPk;
    private long memberPk;
    private String title;
    private SerializedJSONObject content;
    private long rate;
    private long viewCount;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private boolean isAdsense;
    private boolean isUse;
    private Boolean isPublic;
    private boolean membersOnly;

}
