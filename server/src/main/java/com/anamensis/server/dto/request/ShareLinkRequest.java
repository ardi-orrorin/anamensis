package com.anamensis.server.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class ShareLinkRequest {

    @Getter
    @Setter
    public static class Param {

        @NotNull(message = "link is required")
        private String link;
    }


    @Getter
    @Setter
    public static class Use {
        private long id;
        private boolean isUse;
    }

}
