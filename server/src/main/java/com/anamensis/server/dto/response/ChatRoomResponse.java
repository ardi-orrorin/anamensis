package com.anamensis.server.dto.response;

import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class ChatRoomResponse {

    @Getter
    @Builder
    public static class ListItem {
        private Long id;
        private String name;
        private String type;
        private String lastMessage;
        private int userCount;
        private String updatedAt;

        public static ListItem fromListItem(ChatRoomResultMap.ChatRoomListItem resultMap) {
            return new ListItem(
                resultMap.getId(),
                resultMap.getChatRoom().getName(),
                resultMap.getChatRoom().getType().name(),
                resultMap.getChatRoom().getLastMessage(),
                resultMap.getUserCount(),
                resultMap.getChatRoom().getUpdatedAt().toString()
            );
        }
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
