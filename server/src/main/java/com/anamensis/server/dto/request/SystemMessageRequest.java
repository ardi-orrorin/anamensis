package com.anamensis.server.dto.request;

import com.anamensis.server.entity.SystemMessage;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class SystemMessageRequest {

    @Getter
    @Setter
    public static class Body {

        private int id;

        @NotNull(message = "webSysPk is required")
        private String webSysPk;

        @NotNull(message = "subject is required")
        private String subject;

        @NotNull(message = "content is required")
        private String content;

        private String extra1;

        private String extra2;

        private String extra3;

        private String extra4;

        private String extra5;

        public SystemMessage toEntity() {
            SystemMessage systemMessage = new SystemMessage();
            systemMessage.setId(id);
            systemMessage.setWebSysPk(webSysPk);
            systemMessage.setSubject(subject);
            systemMessage.setContent(content);
            if (extra1 != null) systemMessage.setExtra1(extra1);
            if (extra2 != null) systemMessage.setExtra2(extra2);
            if (extra3 != null) systemMessage.setExtra3(extra3);
            if (extra4 != null) systemMessage.setExtra4(extra4);
            if (extra5 != null) systemMessage.setExtra5(extra5);
            return systemMessage;
        }
    }

    @Getter
    @Setter
    public static class isUse {
        private int id;
        private boolean isUse;
    }
}
