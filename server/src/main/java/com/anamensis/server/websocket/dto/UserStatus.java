package com.anamensis.server.websocket.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserStatus {

    private String username;

    private Status status;

    private String profileImage;
}
