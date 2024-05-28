package com.anamensis.server.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TableCode {
    private long id;

    private String tableName;

    private boolean isUse;
}
