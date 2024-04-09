package com.anamensis.server.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class LoginHistoryResponse {

    @Getter
    @Builder
    public static class LoginHistory {
        private long id;

        private String ip;

        private String location;

        private String device;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createAt;

        public static LoginHistory from(com.anamensis.server.entity.LoginHistory loginHistory) {
            return LoginHistory.builder()
                    .id(loginHistory.getId())
                    .ip(loginHistory.getIp())
                    .location(loginHistory.getLocation())
                    .device(loginHistory.getDevice())
                    .createAt(loginHistory.getCreateAt())
                    .build();
        }
    }
}
