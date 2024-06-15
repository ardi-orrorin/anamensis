package com.anamensis.server.dto.response;

import com.anamensis.server.dto.ResetPwdProgress;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.Token;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.resultMap.MemberResultMap;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
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

        public static Login transToLogin(MemberResultMap member, Token token) {
            return Login.builder()
                    .accessToken(token.getAccessToken())
                    .refreshToken(token.getRefreshToken())
                    .accessTokenExpiresIn(token.getAccessTokenExpiresIn())
                    .refreshTokenExpiresIn(token.getRefreshTokenExpiresIn())
                    .username(member.getMember().getUserId())
                    .roles(member.getRoles().stream().map(Role::getRole).toList())
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

        public static MyPage transToMyPage(MemberResultMap user) {
            MyPage my = new MyPage();
            my.setUserId(user.getMember().getUserId());
            my.setEmail(user.getMember().getEmail());
            my.setName(user.getMember().getName());
            my.setPhone(user.getMember().getPhone());
            my.setPoint(user.getMember().getPoint());
            my.setSAuth(user.getMember().getSAuth());
            my.setSAuthType(user.getMember().getSAuthType());
            return my;
        }

        public static MyPage transToMyPage(Member users) {
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

    public static record FindUserId (
        boolean verified,
        String userId
    ) {}

    public static record ResetPwd (
        ResetPwdProgress progress,

        boolean verified
    ) {}
}
