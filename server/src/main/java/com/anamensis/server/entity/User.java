package com.anamensis.server.entity;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Getter
@Setter
@ToString
@Builder
public class User{

    private long id;

    @NotNull(message = "User ID is required")
    private String userId;

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

    private long point;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private boolean isUse;
}
