package com.anamensis.server.dto.response;

import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.entity.BoardTemplate;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class BoardTemplateResponse {

    @Getter
    @Setter
    public static class List implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;

        private long id;
        private String name;

        public static List from(BoardTemplate boardTemplate) {
            List list = new List();
            list.setId(boardTemplate.getId());
            list.setName(boardTemplate.getName());
            return list;
        }
    }

    @Getter
    @Setter
    public static class Detail {
        private long id;

        private String name;
        private Map<String, Object> content;

        private Boolean isPublic;
        private Boolean membersOnly;

        private String updateAt;

        public static Detail from(BoardTemplate boardTemplate) {
            Detail response = new Detail();
            response.setId(boardTemplate.getId());
            response.setName(boardTemplate.getName());
            response.setContent(boardTemplate.getContent().toMap());
            response.setIsPublic(boardTemplate.getIsPublic());
            response.setMembersOnly(boardTemplate.getMembersOnly());
            response.setUpdateAt(boardTemplate.getUpdateAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            return response;
        }
    }
}

