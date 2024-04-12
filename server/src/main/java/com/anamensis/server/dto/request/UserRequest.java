package com.anamensis.server.dto.request;

import com.anamensis.server.entity.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class UserRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Login {
        private String username;
        private String password;
    }

    @Getter
    @Setter
    public static class Register {
        @NotNull(message = "User ID is required")
        private String id;

        @NotNull(message = "Password is required")
        private String pwd;

        @NotNull(message = "Name is required")
        private String name;

        @NotNull(message = "Email is required")
        @Pattern(regexp = "^[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

        @NotNull(message = "Phone number is required")
        @Pattern(regexp = "^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$", message = "Invalid phone number")
        private String phone;

        public static User transToUser(Register reg) {
            return User.builder()
                    .userId(reg.getId())
                    .pwd(reg.getPwd())
                    .name(reg.getName())
                    .email(reg.getEmail())
                    .phone(reg.getPhone())
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .isUse(true)
                    .build();
        }
    }

}
