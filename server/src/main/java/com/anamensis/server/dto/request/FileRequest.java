package com.anamensis.server.dto.request;

public class FileRequest {

    public record Upload(
        long tableCodePk,

        long categoryPk

    ) {}
}
