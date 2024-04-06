package com.anamensis.server.resultMap;


import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserResultMap {

    private long userPk;

    private User user;

    private List<Role> roles;

}
