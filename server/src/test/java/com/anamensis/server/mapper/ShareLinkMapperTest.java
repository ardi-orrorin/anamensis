package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.Users;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

@SpringBootTest
class ShareLinkMapperTest {

    @SpyBean
    private ShareLinkMapper shareLinkMapper;

    Logger log = org.slf4j.LoggerFactory.getLogger(ShareLinkMapperTest.class);

    @Test
    void insert() {
        Users users = new Users();
        users.setId(2);
        users.setUserId("admin");
        users.setPwd("admin");
        users.setName("admin");
        users.setUse(true);

        ShareLink shareLink = ShareLink.builder()
//                .id(1)
                .orgLink("orgLink")
                .shareLink("shareLink")
                .userPk(users.getId())
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

    @Test
    void selectAll() {
        Users users = new Users();
        users.setId(2);
        users.setUserId("admin");
        users.setPwd("admin");
        users.setName("admin");
        users.setUse(true);
        Page page = new Page();
        page.setPage(1);
        page.setSize(10);
//        page.setCriteria("id");
//        page.setOrder("desc");

        shareLinkMapper.selectAll(users, page).forEach(sl -> log.info("sl : " + sl));
    }

    @Test
    void selectCount() {
        Users users = new Users();
        users.setId(2);
        users.setUserId("admin");
        users.setPwd("admin");
        users.setName("admin");
        users.setUse(true);

        log.info("count : " + shareLinkMapper.selectCount(users));
    }
}