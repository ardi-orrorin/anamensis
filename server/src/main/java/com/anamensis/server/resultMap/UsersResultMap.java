package com.anamensis.server.resultMap;


import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.Users;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UsersResultMap {

    private long userPk;

    private Users users;

    private List<Role> roles;

}
