package com.anamensis.server.dto.request;

import com.anamensis.server.entity.Member;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

public class UserConfigSmtpRequest {

    @Getter
    @Setter
    public static class MemberConfigSmtp {

        private long id;

        @NotNull(message = "host is required")
        private String host;

        @Pattern(regexp = "^[0-9]{1,6}$", message = "port is invalid")
        @NotNull(message = "port is required")
        private String port;

        @NotNull(message = "username is required")
        private String username;

        @NotNull(message = "password is required")
        private String password;

        private String fromEmail = "";

        private String fromName = "";

        private Boolean useSSL;

        private Boolean isDefault;

        public static com.anamensis.server.entity.MemberConfigSmtp fromEntity(MemberConfigSmtp entity, Member member) {
            com.anamensis.server.entity.MemberConfigSmtp dto = new com.anamensis.server.entity.MemberConfigSmtp();
            if(entity.getId() != 0) dto.setId(entity.getId());
            dto.setMemberPk(member.getId());
            dto.setHost(entity.getHost());
            dto.setPort(entity.getPort());
            dto.setUsername(entity.getUsername());
            dto.setPassword(entity.getPassword());
            dto.setFromEmail(entity.getFromEmail());
            dto.setFromName(entity.getFromName());
            dto.setUseSSL(entity.getUseSSL());
            dto.setIsUse(true);
            dto.setIsDefault(entity.getIsDefault());
            return dto;
        }
    }

    @Getter
    @Setter
    public static class Test {

        @NotNull(message = "host is required")
        private String host;

        @NotNull(message = "port is required")
        private String port;

        @NotNull(message = "username is required")
        private String username;

        @NotNull(message = "password is required")
        private String password;

        private boolean useSSL;


        public static com.anamensis.server.entity.MemberConfigSmtp toUserConfigSmtp(Test test) {
            com.anamensis.server.entity.MemberConfigSmtp userConfigSmtp = new com.anamensis.server.entity.MemberConfigSmtp();
            userConfigSmtp.setHost(test.getHost());
            userConfigSmtp.setPort(test.getPort());
            userConfigSmtp.setUsername(test.getUsername());
            userConfigSmtp.setPassword(test.getPassword());
            userConfigSmtp.setUseSSL(test.isUseSSL());
            return userConfigSmtp;
        }
    }
}
