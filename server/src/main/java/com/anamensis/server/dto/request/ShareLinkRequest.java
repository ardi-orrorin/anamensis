package com.anamensis.server.dto.request;


import lombok.Getter;
import lombok.Setter;

public class ShareLinkRequest {

    @Getter
    @Setter
    public static class Param {
        private String link;
    }

}
