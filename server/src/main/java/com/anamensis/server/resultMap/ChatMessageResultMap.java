package com.anamensis.server.resultMap;

import com.anamensis.server.entity.ChatMessage;
import com.anamensis.server.entity.Member;
import lombok.Getter;

public class ChatMessageResultMap {

    @Getter
    public static class Detail {
        private long id;
        private ChatMessage chatMessage;
        private Member sender;
    }
}
