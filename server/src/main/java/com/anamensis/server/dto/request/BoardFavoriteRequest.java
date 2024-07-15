package com.anamensis.server.dto.request;

import lombok.Getter;
import lombok.Setter;

public class BoardFavoriteRequest {

    @Getter
    @Setter
    public static class Save {
        private long id;
    }
}
