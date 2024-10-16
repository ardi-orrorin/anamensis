package com.anamensis.server.dto;

public enum ChatType {
    CHAT,
    CHATROOM,
    CHAT_ROOM_LIST,
    CHAT_MESSAGE,
    SERVICE,
    STATUS,
    USERINFO;

    public boolean fromStringEquals(String type) {
        return this.name().equalsIgnoreCase(type);
    }

    public static ChatType fromString(String type) {
        for (ChatType chatType : ChatType.values()) {
            if (chatType.fromStringEquals(type)) {
                return chatType;
            }
        }
        return null;
    }
}
