package com.anamensis.server.dto.response;

import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.resultMap.UserResultMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

public class UserResponse {

    @Getter
    @Builder
    public static class Login {
        private String token;
        private String username;
        private List<RoleType> roles;

        public static Login transToLogin(UserResultMap user, String token) {
            return Login.builder()
                    .token(token)
                    .username(user.getUser().getName())
                    .roles(user.getRoles().stream().map(Role::getRole).toList())
                    .build();
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
