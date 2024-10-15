package com.anamensis.server.dto.response;

import com.anamensis.server.resultMap.ChatRoomResultMap;
import com.anamensis.server.resultMap.MemberResultMap;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class ChatRoomResponse {

    @Getter
    @Builder
    public static class  ListItem {
        private Long id;
        private String name;
        private String type;
        private String lastMessage;
        private List<User> users;
        private String updatedAt;

        public static ListItem fromListItem(ChatRoomResultMap.ChatRoom resultMap) {
            List<User> users = resultMap.getParticipants().stream().map(
                memberResultMap -> User.builder()
                        .id(memberResultMap.getMember().getId())
                        .userId(memberResultMap.getMember().getUserId())
                        .name(memberResultMap.getMember().getName())
                        .profileImage(memberResultMap.getFile().getFullPath())
                        .build()
            ).toList();


            return new ListItem(
                resultMap.getId(),
                resultMap.getChatRoom().getName(),
                resultMap.getChatRoom().getType().name(),
                resultMap.getChatRoom().getLastMessage(),
                users,
                resultMap.getChatRoom().getUpdatedAt().toString()
            );
        }
    }

    @Getter
    @Builder
    public static class User {
        private long id;
        private String userId;
        private String name;
        private String profileImage;
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
        String email,
        String profileImage
    ) {}

    public UserInfo fromUser(MemberResultMap.ListItem resultMap) {
        return new UserInfo(
            resultMap.getMember().getId(),
            resultMap.getMember().getUserId(),
            resultMap.getMember().getName(),
            resultMap.getMember().getEmail(),
            resultMap.getFile().getFullPath()
        );
    }
}
