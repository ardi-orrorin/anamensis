package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class WebSys {

    private String code;

    private String name;

    private String description;

    private RoleType permission;
}
