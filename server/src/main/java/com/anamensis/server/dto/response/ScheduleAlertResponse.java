package com.anamensis.server.dto.response;

import com.anamensis.server.entity.ScheduleAlert;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

public class ScheduleAlertResponse {

    @Getter
    @Builder
    public static class List {
        public long id;
        public String hashId;

        public long boardId;

        public String title;
        public String alertTime;

        public static List fromEntity(ScheduleAlert entity) {
            return List.builder()
                .id(entity.getId())
                .hashId(entity.getHashId())
                .boardId(entity.getBoardId())
                .title(entity.getTitle())
                .alertTime(entity.getAlertTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();
        }

    }
}
