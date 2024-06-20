package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardIndex {
    private long boardId;
    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
