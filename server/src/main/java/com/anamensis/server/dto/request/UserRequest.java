package com.anamensis.server.dto.request;

import com.anamensis.server.dto.ChangePwdStatus;
import com.anamensis.server.dto.ResetPwdProgress;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.RoleType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;

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
    public static class OauthLogin {
        private String userId;
        private String name;
        private String email;
        private String provider;
    }

    @Getter
    @Setter
    @ToString
    public static class Register {
        @NotNull(message = "User ID is required")
        @Size(min = 5, max = 50, message = "User ID must be between 4 and 50 characters")
        private String id;

        @NotNull(message = "Password is required")
        @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        private String pwd;

        @NotNull(message = "Name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        private String name;

        @NotNull(message = "Email is required")
        @Pattern(regexp = "^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

//        @Pattern(regexp = "^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$", message = "Invalid phone number")
        private String phone;

        private boolean emailVerified;

        public static Member transToUser(Register reg) {
            Member users = new Member();
            users.setUserId(reg.getId());
            users.setPwd(reg.getPwd());
            users.setName(reg.getName());
            users.setEmail(reg.getEmail());
            users.setPhone(reg.getPhone());
            users.setEmailVerified(reg.isEmailVerified());
            users.setCreateAt(LocalDateTime.now());
            users.setUpdateAt(LocalDateTime.now());
            users.setUse(true);
            return users;
        }
    }

    @Getter
    @Setter
    public static class EmailVerify {
        @NotNull(message = "Email is required")
        private String email;

        private String code;
    }



    @Getter
    @Setter
    public static class existsMember {

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

        @Size(max = 100, message = "Name must be less than 100 characters")
        private String name;

        @Pattern(regexp = "^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

//        @Pattern(regexp = "^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$", message = "Invalid phone number")
        private String phone;
    }

    @Getter
    @Setter
    public static class FindUserId {

        @NotNull(message = "Name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        @Pattern(regexp = "^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

        private String verifyCode;

        private boolean isVerify;
    }


    @Getter
    @Setter
    @ToString
    public static class ResetPwd {

        private ResetPwdProgress progress;

        @NotNull(message = "User ID is required")
        @Size(min = 5, max = 50, message = "User ID must be between 4 and 50 characters")
        private String userId;

        @NotNull(message = "Email is required")
        @Pattern(regexp = "^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9]+$", message = "Invalid email")
        private String email;

        private String verifyCode;

        private Boolean isVerified;

        private String pwd;

        public void setProgress(String progress) {
            this.progress = ResetPwdProgress.valueOf(progress.toUpperCase());
        }

        public ResetPwdProgress getProgress() {
            return progress;
        }

    }

    @Getter
    @Setter
    @ToString
    public static class Params {

        private String userId;

        private RoleType role;

        public void setRole(String role) {
            this.role = RoleType.valueOf(role.toUpperCase());
        }

    }

    @Getter
    @Setter
    @ToString
    public static class UpdateRole {
        private String mode;
        private List<Long> ids;
        private RoleType role;

        public void setRole(String role) {
            this.role = RoleType.valueOf(role.toUpperCase());
        }
    }

    @Getter
    @Setter
    @ToString
    public static class ChangePassword {

        @NotNull(message = "Current password is required")
        @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        private String curPwd;

        private String newPwd;

        private ChangePwdStatus status;

        public void setStatus(String status) {
            this.status = ChangePwdStatus.valueOf(status.toUpperCase());
        }

    }

}
