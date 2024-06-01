package com.anamensis.server.dto.request;

import com.anamensis.server.entity.SystemMessage;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

public class SystemMessageRequest {

    @Getter
    @Setter
    public static class Body {

        private int id;

        @NotNull(message = "webSysPk is required")
        @Size(min = 1, max = 4, message = "webSysPk must be between 1 and 4 characters")
        private String webSysPk;

        @NotNull(message = "subject is required")
        @Size(min = 1, max = 255, message = "subject must be between 1 and 100 characters")
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
