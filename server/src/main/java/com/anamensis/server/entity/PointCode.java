package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PointCode {

    private long id;
    private String name;
    private long point;
    private boolean isUse;
    private boolean editable;

}
