package com.anamensis.server.dto.request;


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
}
