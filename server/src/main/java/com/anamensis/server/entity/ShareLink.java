package com.anamensis.server.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder // 테스트용도
public class ShareLink {

    private long id;

    private String orgLink;

    private String shareLink;

    private LocalDateTime createAt;

    private boolean isUse;

    private long userPk;
}
