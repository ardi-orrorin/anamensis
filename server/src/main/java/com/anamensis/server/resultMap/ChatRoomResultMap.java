package com.anamensis.server.resultMap;

import com.anamensis.server.entity.Member;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

public class ChatRoomResultMap {

    @Getter
    @ToString
    public static class ChatRoom {
        private long id;
        private com.anamensis.server.entity.ChatRoom chatRoom;
        private Member host;
        private List<Member> participants;
    }

    @Getter
    @ToString
    public static class ChatRoomListItem {
        private long id;
        private com.anamensis.server.entity.ChatRoom chatRoom;
        private int userCount;
    }
}
