package com.anamensis.batch.entity;

import java.time.LocalDateTime;

public record File(
    long id,
    int tableCodePk,
    long tableRefPk,
    String orgFileName,
    String fileName,
    String filePath,
    LocalDateTime createAt,
    boolean isUse
) {
}
