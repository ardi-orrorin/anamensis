package com.anamensis.server.entity;

public enum AuthType {
    NONE,
    OTP,
    EMAIL;

    // Add this line

    public boolean equals(String authStr) {
        return this.name().equals(authStr.toUpperCase());
    }

    public static AuthType fromString(String authStr) {
        return AuthType.valueOf(authStr.toUpperCase());
    }

}
