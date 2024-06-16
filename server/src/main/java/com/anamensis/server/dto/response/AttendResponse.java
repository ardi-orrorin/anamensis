package com.anamensis.server.dto.response;

import com.anamensis.server.entity.Attendance;
import com.anamensis.server.entity.Member;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDate;

public class AttendResponse {

    @Getter @Builder @ToString
    public static class AttendInfo implements Serializable {

        private String userId;

        private String email;

        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate lastDate;

        private int days;

        private long point;

        public static AttendInfo mergeUserAndAttendance(Member users, Attendance attendance) {
            return AttendInfo.builder()
                    .userId(users.getUserId())
                    .email(users.getEmail())
                    .lastDate(attendance.getLastDate())
                    .days(attendance.getDays())
                    .point(users.getPoint())
                    .build();
        }
    }



}
