package com.anamensis.server.entity;

import com.anamensis.server.dto.SerializedJSONObject;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardTemplate {

    private long id;
    private long memberPk;
    private SerializedJSONObject content;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private Boolean isPublic;
    private boolean membersOnly;
    private boolean isUse;
}
