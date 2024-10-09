package com.anamensis.server.entity;

import com.anamensis.server.dto.RoomType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class ChatRoom {
    private Long id;
    private String name;
    private RoomType type;
    private Long hostId;
    private String lastMessage;
    private Instant createdAt;
    private Instant updatedAt;
}
