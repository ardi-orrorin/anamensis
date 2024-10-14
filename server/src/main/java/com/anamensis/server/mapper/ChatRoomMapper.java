package com.anamensis.server.mapper;

import com.anamensis.server.entity.ChatRoom;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ChatRoomMapper {

    int save(ChatRoom entity);

    int saveChatRoomUser(long chatRoomId, List<Long> userIds);
//
//    int update(ChatRoom entity);
//
//    int delete(long id);
//
    Optional<ChatRoomResultMap.ChatRoom> selectById(long id);

    List<ChatRoomResultMap.ChatRoomListItem> selectAll(String userId);

    List<ChatRoomResultMap.ChatRomeUserCount> chatRoomIdByUsers(String firstUserId, String secondUserId);
}
