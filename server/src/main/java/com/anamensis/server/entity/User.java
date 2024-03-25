package com.anamensis.server.entity;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Setter;

import java.time.LocalDateTime;

public record User(
    long id,
    @NotNull
    String userId,
    @NotNull
    String pwd,
    @NotNull
    String name,
    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z0-9]+$")
    String email,

    @NotNull
    @Pattern(regexp = "^01(?:0|1|[6-9])-(?:\\d{3}|\\d{4})-\\d{4}$")
    String phone,

    LocalDateTime createAt,

    LocalDateTime updateAt,

    boolean isUse

) { }
