package com.anamensis.server.dto;

import java.util.List;


public record PageResponse<T>(
    Page page,
    List<T> content
) {

}
