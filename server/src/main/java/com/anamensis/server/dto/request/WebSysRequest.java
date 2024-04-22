package com.anamensis.server.dto.request;


import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class WebSysRequest {

    @Getter
    @Setter
    public static class WebSysList {
        private List<WebSys> list;
    }


    @Getter
    @Setter
    public static class WebSysReq {
        private String code;
        private String name;
        private String description;
        private String permission;

        public WebSys toEntity() {
            WebSys webSys = new WebSys();
            webSys.setCode(this.code);
            webSys.setName(this.name);
            webSys.setDescription(this.description);
            webSys.setPermission(RoleType.valueOf(this.permission));

            return webSys;
        }
    }


}
