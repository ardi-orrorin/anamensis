package com.anamensis.server.dto.response;

import com.anamensis.server.entity.AuthType;
import com.anamensis.server.resultMap.OtpResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class OtpResponse {

    @Getter
    @Setter
    public static class Info {

        private long id;

        private boolean sAuth;

        private AuthType sAuthType;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createAt;

        public static Info fromOtpResultMap(OtpResultMap otpResultMap) {
            Info info = new Info();
            info.setId(otpResultMap.getId());
            info.setSAuth(otpResultMap.getMember().getSAuth());
            info.setSAuthType(otpResultMap.getMember().getSAuthType());
            info.setCreateAt(otpResultMap.getOtp().getCreateAt());

            return info;
        }
    }


}
