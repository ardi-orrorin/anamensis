package com.anamensis.server.dto.response;

import com.anamensis.server.dto.seriallizer.StringNullSerializer;
import com.anamensis.server.resultMap.SmtpPushHistoryResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

public class SmtpPushHistoryResponse {

    @Getter
    @ToString
    @Builder
    public static class ListSmtpPushHistory {
        private long id;

        @JsonSerialize(nullsUsing = StringNullSerializer.class)
        private String subject;

        @JsonSerialize(nullsUsing = StringNullSerializer.class)
        private String status;

        @JsonSerialize(nullsUsing = StringNullSerializer.class)
        private String message;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createAt;

        public static ListSmtpPushHistory fromResultMap(SmtpPushHistoryResultMap.ListSmtpPushHistory smtpPushHistory) {
            return ListSmtpPushHistory.builder()
                    .id(smtpPushHistory.getId())
                    .subject(smtpPushHistory.getSubject())
                    .status(smtpPushHistory.getStatus())
                    .message(smtpPushHistory.getMessage())
                    .createAt(smtpPushHistory.getCreateAt())
                    .build();
        }
    }
}
