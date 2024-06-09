package com.anamensis.server.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

public class ShareLinkResponse {

    @Getter
    @ToString
    public static class Redirect {
        private String url;

        public static Redirect of(String url) {
            Redirect redirect = new Redirect();
            redirect.url = "redirect://" +  url;
            return redirect;
        }
    }

    @Getter
    @Builder
    @ToString
    public static class ShareLink {
        private String id;

        private String orgLink;

        private String shareLink;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createAt;

        public static ShareLink transToShareLink(com.anamensis.server.entity.ShareLink shareLink) {
            return ShareLink.builder()
                    .id(String.valueOf(shareLink.getId()))
                    .orgLink(shareLink.getOrgLink())
                    .shareLink("/link" + shareLink.getShareLink())
                    .createAt(shareLink.getCreateAt())
                    .build();
        }
    }

    @Getter
    @Builder
    @ToString
    public static class Use {
        private long id;
        private boolean isUse;

        public static Use of(com.anamensis.server.entity.ShareLink shareLink) {
            return Use.builder()
                    .id(shareLink.getId())
                    .isUse(shareLink.isUse())
                    .build();
        }

    }


}
