package com.anamensis.server.dto.request;

import com.anamensis.server.dto.SerializedJSONObject;
import com.anamensis.server.entity.BoardTemplate;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class BoardTemplateRequest {

    @Getter
    @Setter
    public static class Save {
        private String name;
        private Map<String, Object> content;
        private Boolean isPublic;
        private Boolean membersOnly;

        public static BoardTemplate toEntity(Save boardTemplate, long memberPk) {
            BoardTemplate entity = new BoardTemplate();

            entity.setName(boardTemplate.getName());
            entity.setContent(new SerializedJSONObject(boardTemplate.getContent()));
            entity.setIsPublic(boardTemplate.getIsPublic());
            entity.setMembersOnly(boardTemplate.getMembersOnly());
            entity.setCreateAt(LocalDateTime.now());
            entity.setUpdateAt(LocalDateTime.now());
            entity.setMemberPk(memberPk);

            return entity;
        }
    }

    @Getter
    @Setter
    public static class DisableIds {
        private List<Long> ids;
    }

}
