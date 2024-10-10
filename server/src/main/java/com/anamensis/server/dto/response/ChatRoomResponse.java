package com.anamensis.server.dto.response;

import com.anamensis.server.entity.ChatRoom;

public class ChatRoomResponse {

    public record ListItem(
        Long id,
        String name,
        String type,
        String lastMessage,
        int userCount,
        String updatedAt
    ) {}

    // todo:  참가자 수 있는 resultmap으로 변경
    public ListItem fromListItem(ChatRoom entity) {
        return new ListItem(
            entity.getId(),
            entity.getName(),
            entity.getType().name(),
            entity.getLastMessage(),
            0,
            entity.getUpdatedAt().toString()
        );
    }
}
