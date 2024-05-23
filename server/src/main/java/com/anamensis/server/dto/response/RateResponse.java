package com.anamensis.server.dto.response;

import lombok.Getter;
import lombok.Setter;

public class RateResponse {

    @Getter
    @Setter
    public static class Info {
        private long id;

        private long count;

        private boolean status;
    }

}
