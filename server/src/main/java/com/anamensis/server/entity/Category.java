package com.anamensis.server.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class Category {
    private long id;

    private String name;

    private Long parentPK;

    private boolean isUse;
}
