package com.anamensis.server.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ScheduleAlert {

    private long id;

    private String hashId;

    private long boardId;

    private String userId;

    private String title;

    private LocalDateTime alertTime;

    private boolean isRead;
}
