package com.anamensis.server.service;

import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.ShareLinkMapper;
import com.anamensis.server.provider.ShareLinkProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

@SpringBootTest
class ShareLinkServiceTest {

    @SpyBean
    private ShareLinkMapper shareLinkMapper;

    @SpyBean
    private ShareLinkProvider shareLinkProvider;

    Logger log = org.slf4j.LoggerFactory.getLogger(ShareLinkServiceTest.class);

    User user;
    String orgLink;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(2)
                .userId("admin")
                .pwd("admin")
                .name("admin")
                .build();

        orgLink = "orgLink";
    }

    @Test
    void insert() { //User user, String orgLink
        String shareLinkStr;
        ShareLink shareLink = ShareLink.builder()
                .orgLink(orgLink)
                .shareLink(shareLinkProvider.generateShareLink())
                .userPk(user.getId())
                .build();

        do {
            shareLinkStr = shareLinkProvider.generateShareLink();
        } while (shareLinkMapper.selectByShareLink(shareLinkStr).isPresent());

        int result = shareLinkMapper.insert(shareLink, user);

        log.info("shareLink : " + shareLink.getShareLink());
    }

    @Test
    void selectByShareLink() {
//        String shareLink = "shareLink"; // error
        String shareLink = "blrNLNtZuzMHRCM";
        ShareLink sl = shareLinkMapper.selectByShareLink(shareLink)
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));

        log.info("shareLink : " + sl);
    }

    @Test
    void updateUse() {
        String shareLink = "blrNLNtZuzMHRCM";
        ShareLink sl = shareLinkMapper.selectByShareLink(shareLink)
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));
        sl.setUse(false);
        shareLinkMapper.updateUse(sl);
    }

}