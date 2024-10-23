package com.anamensis.server.dto.request;

import com.anamensis.server.entity.PointCode;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class PointCodeRequest {

    @Getter
    public static class UpdateList {
        private Update[] list;
    }

    @Getter
    @Builder
    public static class Update {
        private long id;
        private String name;
        private long point;
        private boolean editable;

        public PointCode toEntity() {

            PointCode pointCode = new PointCode();
            pointCode.setId(id);
            pointCode.setName(name);
            pointCode.setPoint(point);
            pointCode.setEditable(editable);

            return pointCode;
        }
    }

    @Getter
    public static class Reset {
        private List<Long> ids;
        private boolean all;
    }

}
