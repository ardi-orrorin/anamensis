package com.anamensis.server.dto.response;

import com.anamensis.server.entity.ScheduleAlert;
import com.anamensis.server.resultMap.ScheduleAlertResultMap;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

public class ScheduleAlertResponse {

    @Getter
    @Builder
    public static class List {

        public long id;
        public String hashId;

        public String boardTitle;
        public long boardId;

        public String title;
        public String alertTime;

        public Boolean isRead;

        public static List from(ScheduleAlert entity) {
            return List.builder()
                .id(entity.getId())
                .hashId(entity.getHashId())
                .boardId(entity.getBoardId())
                .title(entity.getTitle())
                .alertTime(entity.getAlertTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .isRead(entity.isRead())
                .build();
        }

        public static List from(ScheduleAlertResultMap resultMap) {
            return List.builder()
                .id(resultMap.getId())
                .hashId(resultMap.getScheduleAlert().getHashId())
                .boardTitle(resultMap.getBoard().getTitle())
                .boardId(resultMap.getBoard().getId())
                .title(resultMap.getScheduleAlert().getTitle())
                .alertTime(resultMap.getScheduleAlert().getAlertTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .isRead(resultMap.getScheduleAlert().isRead())
                .build();
        }
    }
}

