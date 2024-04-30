package com.anamensis.server.dto;

public record FilePathDto(
    String path,
    String file,
    int width,
    int height
) {
}
