package com.anamensis.server.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class PointCode {

    private long id;
    private String name;
    private long value;
    private boolean isUse;

}
