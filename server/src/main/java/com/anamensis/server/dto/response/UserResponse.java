package com.anamensis.server.dto.response;

import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.Token;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.User;
import com.anamensis.server.resultMap.UserResultMap;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

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
    @Setter
    public static class MyPage {
        private String userId;
        private String email;
        private String phone;
        private String name;
        private long point;
        private Boolean sAuth;
        private AuthType sAuthType;

        public static MyPage transToMyPage(UserResultMap user) {
            MyPage my = new MyPage();
            my.setUserId(user.getUser().getUserId());
            my.setEmail(user.getUser().getEmail());
            my.setName(user.getUser().getName());
            my.setPhone(user.getUser().getPhone());
            my.setPoint(user.getUser().getPoint());
            my.setSAuth(user.getUser().getSAuth());
            my.setSAuthType(user.getUser().getSAuthType());
            return my;
        }

        public static MyPage transToMyPage(User user) {
            MyPage my = new MyPage();
            my.setUserId(user.getUserId());
            my.setEmail(user.getEmail());
            my.setName(user.getName());
            my.setPhone(user.getPhone());
            my.setPoint(user.getPoint());
            my.setSAuth(user.getSAuth());
            my.setSAuthType(user.getSAuthType());
            return my;
        }
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
