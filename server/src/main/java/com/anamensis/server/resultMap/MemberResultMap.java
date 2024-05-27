package com.anamensis.server.resultMap;


import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class MemberResultMap {

    private long memberPk;

    private Member member;

    private List<Role> roles;

}
