package com.anamensis.server.dto.request;

import com.anamensis.server.dto.RoomType;

import java.util.List;

public class ChatRoomRequest {

    public record Create(
        String name,
        String hostUser,
        List<String> inviteUser,
        RoomType chatType
    ) {}

    public record Update(
        Long id,
        String name,
        String hostUser,
        RoomType chatType
    ) {}

    public record InviteUser(
        Long chatRoomId,
        List<String> inviteUsers
    ) {}
}
