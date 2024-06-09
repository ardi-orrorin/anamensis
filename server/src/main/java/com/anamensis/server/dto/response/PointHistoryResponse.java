package com.anamensis.server.dto.response;

import com.anamensis.server.resultMap.PointHistoryResultMap;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class PointHistoryResponse {

    @Getter
    @Builder
    public static class List {
        private long id;
        private String tableName;

        private String pointCodeName;

        private long point;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        public static List fromResultMap(PointHistoryResultMap result) {
            return PointHistoryResponse.List.builder()
                    .id(result.getId())
                    .tableName(result.getTableCode().getTableName())
                    .pointCodeName(result.getPointCode().getName())
                    .point(result.getPointCode().getPoint())
                    .createdAt(result.getPointHistory().getCreateAt())
                    .build();
        }

    }

    @Getter
    @Builder
    public static class Summary {
        private long id;
        private String tableName;
        private long point;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        public static Summary fromResultMap(PointHistoryResultMap result) {
            return PointHistoryResponse.Summary.builder()
                    .id(result.getId())
                    .tableName(result.getTableCode().getTableName())
                    .point(result.getPointCode().getPoint())
                    .createdAt(result.getPointHistory().getCreateAt())
                    .build();
        }
    }
}
