package com.anamensis.server.websocket.dto;

import com.anamensis.server.entity.ChatMessage;

import java.awt.image.DataBuffer;
import java.time.Instant;

public record WebsocketDTO(
    String type,
    long routeId,
    String content,
    boolean inputting,
    DataBuffer data,
    String createdAt
) {
    public ChatMessage toChatMessage(long userId) {
        return new ChatMessage(
            0,
            this.routeId,
            userId,
            this.content,
            Instant.now(),
            false,
            null
        );
    }
}
