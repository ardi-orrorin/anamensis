package com.anamensis.server.dto.response;

import com.anamensis.server.dto.AuthType;
import com.anamensis.server.dto.Token;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.resultMap.UserResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

public class UserResponse {

    @Getter
    @Builder
    public static class Login {

        private String accessToken;

        private long accessTokenExpiresIn;

        private String refreshToken;

        private long refreshTokenExpiresIn;

        private String username;
        private List<RoleType> roles;

        public static Login transToLogin(UserResultMap user, Token token) {
            return Login.builder()
                    .accessToken(token.getAccessToken())
                    .refreshToken(token.getRefreshToken())
                    .accessTokenExpiresIn(token.getAccessTokenExpiresIn())
                    .refreshTokenExpiresIn(token.getRefreshTokenExpiresIn())
                    .username(user.getUser().getName())
                    .roles(user.getRoles().stream().map(Role::getRole).toList())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class Auth {

        private AuthType authType;

        private boolean verity;

    }



    @Getter
    public static class Status {
        private final HttpStatus status;
        private final String message;

        private Status(HttpStatus status, String message) {
            this.status = status;
            this.message = message;
        }

        public static Status transToStatus(HttpStatus status, String message) {
            return new Status(status, message);
        }
    }
}
