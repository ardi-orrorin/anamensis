package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class File implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private long id;

    private long tableCodePk;

    private long tableRefPk;

    private String orgFileName;

    private String fileName;

    private String filePath;

    private LocalDateTime createAt;

    private boolean isUse;

}
