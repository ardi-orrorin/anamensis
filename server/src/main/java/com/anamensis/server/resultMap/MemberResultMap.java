package com.anamensis.server.resultMap;


import com.anamensis.server.entity.File;
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

    @Getter
    @Setter
    public static class ListItem {
        private long memberPk;
        private Member member;
        private File file;
    }

}
