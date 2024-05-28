package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class File {
    private long id;

    private long tableCodePk;

    private long tableRefPk;

    private String orgFileName;

    private String fileName;

    private String filePath;

    private LocalDateTime createAt;

    private boolean isUse;

}
