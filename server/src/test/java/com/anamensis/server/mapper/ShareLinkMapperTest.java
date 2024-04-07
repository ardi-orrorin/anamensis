package com.anamensis.server.mapper;

import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.User;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ShareLinkMapperTest {

    @SpyBean
    private ShareLinkMapper shareLinkMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(ShareLinkMapperTest.class);

    @Test
    void insert() {
        User user = User.builder()
                .id(2)
                .userId("admin")
                .pwd("admin")
                .name("admin")
                .isUse(true)
                .build();
        ShareLink shareLink = ShareLink.builder()
//                .id(1)
                .orgLink("orgLink")
                .shareLink("shareLink")
                .userPk(user.getId())
                .isUse(true)
                .build();
        shareLinkMapper.insert(shareLink);
    }

    @Test
    void selectByShareLink() {
        log.info("shareLink : " + shareLinkMapper.selectByShareLink("shareLink"));
    }

    @Test
    void updateUse() {
        ShareLink sl = shareLinkMapper.selectByShareLink("shareLink")
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));
        sl.setUse(false);
        shareLinkMapper.updateUse(sl);
    }
}