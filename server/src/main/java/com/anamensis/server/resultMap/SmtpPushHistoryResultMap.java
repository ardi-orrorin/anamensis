package com.anamensis.server.resultMap;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

public class SmtpPushHistoryResultMap {

    @Getter
    @Setter
    @ToString
    @Alias("ListSmtpPushHistory")
    public static class ListSmtpPushHistory {
        private long id;
        private String subject;
        private String status;
        private String message;
        private LocalDateTime createAt;
    }
}
