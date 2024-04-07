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

    private String userId;

    private String pwd;

    private String name;

    private String email;

    private String phone;

    private long point;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private boolean isUse;
}
