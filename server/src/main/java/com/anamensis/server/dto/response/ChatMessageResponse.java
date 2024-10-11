package com.anamensis.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;

public class ChatMessageResponse {

    @Getter
    @AllArgsConstructor
    @ToString
    public static class ChatMessage implements Serializable {
        private long id;
        private long chatRoomId;
        private String sender;
        private boolean inputting;
        private boolean completed;
        private String content;
        private String createdAt;
    }

    public ChatMessage from(long id, boolean inputting, boolean completed, String username, com.anamensis.server.entity.ChatMessage chat) {
        return new ChatMessage(
            id,
            chat.getChatRoomId(),
            username,
            inputting,
            completed,
            chat.getContent(),
            chat.getCreatedAt().toString()
        );
    }

}
