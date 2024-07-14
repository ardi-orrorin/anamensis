package com.anamensis.server.resultMap;


import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MemberResultMap {

    private long memberPk;

    private Member member;

    private List<Role> roles;

}
