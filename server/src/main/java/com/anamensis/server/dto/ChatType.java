package com.anamensis.server.dto;

public enum ChatType {
    CHAT,
    SERVICE;

    public boolean fromStringEquals(String type) {
        return this.name().equalsIgnoreCase(type);
    }
}
