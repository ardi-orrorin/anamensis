package com.anamensis.server.websocket.dto;

public enum Status {
    ONLINE,
    WORKING,
    OFFLINE,
    AWAY;

    public boolean fromStringEquals(String string) {
        return this.name().equalsIgnoreCase(string);
    }

    public static Status fromString(String string) {

        for (Status status : Status.values()) {
            if (status.fromStringEquals(string)) {
                return status;
            }
        }

        return null;
    }
}
