package com.anamensis.server.dto.response;

import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.Token;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.Users;
import com.anamensis.server.resultMap.UsersResultMap;
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

        public static Login transToLogin(UsersResultMap user, Token token) {
            return Login.builder()
                    .accessToken(token.getAccessToken())
                    .refreshToken(token.getRefreshToken())
                    .accessTokenExpiresIn(token.getAccessTokenExpiresIn())
                    .refreshTokenExpiresIn(token.getRefreshTokenExpiresIn())
                    .username(user.getUsers().getName())
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

        public static MyPage transToMyPage(UsersResultMap user) {
            MyPage my = new MyPage();
            my.setUserId(user.getUsers().getUserId());
            my.setEmail(user.getUsers().getEmail());
            my.setName(user.getUsers().getName());
            my.setPhone(user.getUsers().getPhone());
            my.setPoint(user.getUsers().getPoint());
            my.setSAuth(user.getUsers().getSAuth());
            my.setSAuthType(user.getUsers().getSAuthType());
            return my;
        }

        public static MyPage transToMyPage(Users users) {
            MyPage my = new MyPage();
            my.setUserId(users.getUserId());
            my.setEmail(users.getEmail());
            my.setName(users.getName());
            my.setPhone(users.getPhone());
            my.setPoint(users.getPoint());
            my.setSAuth(users.getSAuth());
            my.setSAuthType(users.getSAuthType());
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
