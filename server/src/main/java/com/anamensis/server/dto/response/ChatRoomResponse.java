package com.anamensis.server.dto.response;

import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.ChatRoomResultMap;

import java.util.List;

public class ChatRoomResponse {

    public record ListItem(
        Long id,
        String name,
        String type,
        String lastMessage,
        int userCount,
        String updatedAt
    ) {}

    public ListItem fromListItem(ChatRoomResultMap.ChatRoomListItem resultMap) {
        return new ListItem(
            resultMap.getId(),
            resultMap.getChatRoom().getName(),
            resultMap.getChatRoom().getType().name(),
            resultMap.getChatRoom().getLastMessage(),
            resultMap.getUserCount(),
            resultMap.getChatRoom().getUpdatedAt().toString()
        );
    }

    public record Detail(
        Long id,
        String name,
        String type,
        String host,
        List<UserInfo> users,
        String createdAt,
        String updatedAt
    ) {}

    public Detail fromDetail(ChatRoomResultMap.ChatRoom resultMap) {
        return new Detail(
            resultMap.getId(),
            resultMap.getChatRoom().getName(),
            resultMap.getChatRoom().getType().name(),
            resultMap.getHost().getUserId(),
            resultMap.getParticipants().stream().map(this::fromUser).toList(),
            resultMap.getChatRoom().getCreatedAt().toString(),
            resultMap.getChatRoom().getUpdatedAt().toString()
        );
    }

    public record UserInfo(
        Long id,
        String username,
        String nickname,
        String email
    ) {}

    public UserInfo fromUser(Member user) {
        return new UserInfo(
            user.getId(),
            user.getUserId(),
            user.getName(),
            user.getEmail()
        );
    }
}
