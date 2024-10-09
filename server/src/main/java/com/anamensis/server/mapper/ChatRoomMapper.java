package com.anamensis.server.mapper;

import com.anamensis.server.entity.ChatRoom;
import com.anamensis.server.resultMap.ChatRoomResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatRoomMapper {

//    int save(ChatRoom entity);
//
//    int update(ChatRoom entity);
//
//    int delete(long id);
//
    ChatRoomResultMap.ChatRoom selectById(long id);

    List<ChatRoom> selectAll(String hostUsername);

}
