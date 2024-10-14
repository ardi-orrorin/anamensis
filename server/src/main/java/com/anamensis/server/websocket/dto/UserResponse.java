package com.anamensis.server.websocket.dto;

import lombok.Builder;
import lombok.Getter;

public class UserResponse {

    @Getter
    @Builder
    public static class UserStatus {

        private long id;

        private String username;

        private Status status;

        private String profileImage;
    }

    @Getter
    @Builder
    public static class UserInfo {

        private long id;

        private String userId;

        private String name;

        private String email;

        private String phone;

        private long point;

        private Status status;

        private String profileImage;
    }

}
