package com.anamensis.server.dto.request;

import com.anamensis.server.entity.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.lang.reflect.Type;
import java.time.LocalDateTime;

public class UserRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Login {
        private String username;
        private String password;

        private Boolean verify;
        private String authType;
        private Integer code;
    }

    @Getter
    @Setter
    @ToString
    public static class Register {
        @NotNull(message = "User ID is required")
        private String id;

        @NotNull(message = "Password is required")
        private String pwd;

        @NotNull(message = "Name is required")
        private String name;

        @NotNull(message = "Email is required")
        @Pattern(regexp = "^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

        @NotNull(message = "Phone number is required")
        @Pattern(regexp = "^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$", message = "Invalid phone number")
        private String phone;

        public static User transToUser(Register reg) {
            User user = new User();
            user.setUserId(reg.getId());
            user.setPwd(reg.getPwd());
            user.setName(reg.getName());
            user.setEmail(reg.getEmail());
            user.setPhone(reg.getPhone());
            user.setCreateAt(LocalDateTime.now());
            user.setUpdateAt(LocalDateTime.now());
            user.setUse(true);
            return user;
        }
    }

    @Getter
    @Setter
    public static class EmailVerify {
        @NotNull(message = "Email is required")
        private String email;

//        @NotNull(message = "Code is required")
        private String code;
    }



    @Getter
    @Setter
    public static class existsUser {

        @NotNull(message = "Type is required")
        private String type;

        @NotNull(message = "Value is required")
        private String value;
    }

    @Getter
    @Setter
    public static class SAuth {

        @NotNull(message = "SAuth is required")
        private boolean sauth;

        @NotNull(message = "SAuthType is required")
        private String sauthType;
    }

    @Getter
    @Setter
    public static class Profile {

        @NotNull(message = "Name is required")
        private String name;

        @NotNull(message = "Email is required")
        @Pattern(regexp = "^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

        @NotNull(message = "Phone number is required")
        @Pattern(regexp = "^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$", message = "Invalid phone number")
        private String phone;
    }
}
