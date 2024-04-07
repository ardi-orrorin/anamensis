package com.anamensis.server.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class CategoryRequest {

    @Getter
    @Setter
    @Builder
    public static class Create {
        private Long parentId;

        @NotNull
        @Size(min = 2)
        private String name;
    }

    @Getter
    @Setter
    @Builder
    public static class Update {
        private long id;

        @NotNull
        @Size(min = 2)
        private String name;

        private Long parentId;
    }

    @Getter
    @Setter
    @Builder
    public static class Delete {

        private long id;
    }

}
