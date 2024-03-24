package com.anamensis.server.entity;


import java.time.LocalDateTime;

public record User(
    long id,
    String userId,
    String pwd,
    String name,

    String email,

    String phone,

    LocalDateTime createAt,

    LocalDateTime updateAt,

    boolean isUse

) { }
