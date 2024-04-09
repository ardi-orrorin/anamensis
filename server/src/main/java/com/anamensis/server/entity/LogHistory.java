package com.anamensis.server.entity;

import lombok.Builder;
import lombok.Getter;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import java.time.LocalDateTime;

@Getter
@Builder
public class LogHistory {

    private long id;

    private long userPk;

    private String method;

    private String path;

    private String query;

    private String body;

    private String uri;

    private String headers;

    private String session;

    private String localAddress;

    private String remoteAddress;

    private LocalDateTime createAt;
}
