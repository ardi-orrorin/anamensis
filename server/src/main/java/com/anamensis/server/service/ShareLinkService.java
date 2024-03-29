package com.anamensis.server.service;

import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.ShareLinkMapper;
import com.anamensis.server.provider.ShareLinkProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShareLinkService {
    private final ShareLinkMapper shareLinkMapper;

    private final ShareLinkProvider shareLinkProvider;

    public String insert(ShareLink shareLink, User user) {

        String shareLinkStr;

        do {
            shareLinkStr = shareLinkProvider.generateShareLink();
        } while (shareLinkMapper.selectByShareLink(shareLinkStr).isEmpty());

        shareLink.setCreateAt(LocalDateTime.now());
        shareLinkMapper.insert(shareLink, user);

        return shareLinkStr;
    }

    public ShareLink selectByShareLink(String shareLink) {
        return shareLinkMapper.selectByShareLink(shareLink)
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));
    }

    public boolean updateUse(String shareLink, boolean isUse) {
        ShareLink sl = shareLinkMapper.selectByShareLink(shareLink)
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));
        sl.setUse(isUse);
        int result = shareLinkMapper.updateUse(sl);

        return result == 1;
    }



}
