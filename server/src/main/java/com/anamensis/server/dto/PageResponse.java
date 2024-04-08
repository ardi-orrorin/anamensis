package com.anamensis.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@Builder
public class PageResponse<T> {

    private Page page;

    private List<T> content;



}
