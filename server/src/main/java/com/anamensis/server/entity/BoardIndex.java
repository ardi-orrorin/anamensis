package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class BoardIndex {
    private long boardId;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
