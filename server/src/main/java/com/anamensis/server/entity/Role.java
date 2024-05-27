package com.anamensis.server.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Role {

    private RoleType role;

    private long memberPk;
}
