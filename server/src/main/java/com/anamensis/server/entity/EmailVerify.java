package com.anamensis.server.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder
public class EmailVerify {
    private long id;

    private String email;

    private String code;

    private LocalDateTime createAt;

    private LocalDateTime expireAt;

    private boolean isUse;
}
