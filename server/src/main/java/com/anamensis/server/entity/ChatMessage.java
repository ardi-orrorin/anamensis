package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class ChatMessage {
    private long id;
    private long chatRoomId;
    private long senderUserId;
    private String content;
    private Instant createdAt;
}
