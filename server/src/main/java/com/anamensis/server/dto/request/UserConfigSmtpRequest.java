package com.anamensis.server.dto.request;

import com.anamensis.server.entity.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

public class UserConfigSmtpRequest {

    @Getter
    @Setter
    public static class UserConfigSmtp {

        @NotNull(message = "host is required")
        private String host;

        @Pattern(regexp = "^[0-9]*$")
        @NotNull(message = "port is required")
        private String port;

        @NotNull(message = "username is required")
        private String username;

        @NotNull(message = "password is required")
        private String password;

        private String fromEmail;

        private String fromName;

        private boolean useSSL;

        public static com.anamensis.server.entity.UserConfigSmtp fromEntity(UserConfigSmtp entity, User user) {
            com.anamensis.server.entity.UserConfigSmtp dto = new com.anamensis.server.entity.UserConfigSmtp();
            dto.setUserPk(user.getId());
            dto.setHost(entity.getHost());
            dto.setPort(entity.getPort());
            dto.setUsername(entity.getUsername());
            dto.setPassword(entity.getPassword());
            dto.setFromEmail(entity.getFromEmail());
            dto.setFromName(entity.getFromName());
            dto.setUseSSL(entity.isUseSSL());
            dto.setIsUse(true);
            return dto;
        }
    }
}