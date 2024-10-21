package com.anamensis.server.dto.response;

import com.anamensis.server.entity.PointCode;
import lombok.Builder;
import lombok.Getter;

public class PointCodeResponse {

    @Getter
    @Builder
    public static class ListItem {
        private long id;
        private String name;
        private long point;
        private boolean editable;

        public static ListItem fromEntity(PointCode pointCode) {
            return ListItem.builder()
                    .id(pointCode.getId())
                    .name(pointCode.getName())
                    .point(pointCode.getPoint())
                    .editable(pointCode.isEditable())
                    .build();
        }

    }
}
