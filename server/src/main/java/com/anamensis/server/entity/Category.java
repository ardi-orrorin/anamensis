package com.anamensis.server.entity;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private long id;

    private String name;

    private Long parentPK;

    private boolean isUse;
}
