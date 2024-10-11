package com.anamensis.server.mapper;

import com.anamensis.server.entity.ChatMessage;
import org.apache.ibatis.annotations.Mapper;

import java.time.Instant;
import java.util.List;

@Mapper
public interface ChatMessageMapper {

    int save(ChatMessage chatMessage);

    List<ChatMessage> findAllByChatRoomId(long chatRoomId, Instant createdAt);
}
