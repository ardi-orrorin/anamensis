package com.anamensis.server.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Token {
    private String accessToken;
    private String refreshToken;

}
