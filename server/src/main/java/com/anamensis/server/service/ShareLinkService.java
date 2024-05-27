package com.anamensis.server.service;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.ShareLinkRequest;
import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.Member;
import com.anamensis.server.mapper.ShareLinkMapper;
import com.anamensis.server.provider.ShareLinkProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.util.function.Tuple2;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShareLinkService {
    private final ShareLinkMapper shareLinkMapper;

    private final ShareLinkProvider shareLinkProvider;

    public Tuple2<List<ShareLink>, Page>  selectAll(Tuple2<Member, Page> t) {
        return t.mapT1(u -> shareLinkMapper.selectAll(u, t.getT2()))
                .mapT2(p -> {
                    p.setTotal(shareLinkMapper.selectCount(t.getT1()));
                    return p;
                });
    }

    public ShareLink insert(String link, Member users) {
        String shareLinkStr;

        do {
            shareLinkStr = shareLinkProvider.generateShareLink();
        } while (shareLinkMapper.selectByShareLink(shareLinkStr).isPresent());

        ShareLink shareLink = ShareLink.builder()
                .orgLink(link)
                .shareLink(shareLinkStr)
                .createAt(LocalDateTime.now())
                .isUse(true)
                .userPk(users.getId())
                .build();

        shareLinkMapper.insert(shareLink);


        return shareLink;
    }

    public ShareLink selectByShareLink(String shareLink) {
        return shareLinkMapper.selectByShareLink(shareLink)
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));
    }

    @Transactional
    public ShareLink updateUse(Tuple2<ShareLinkRequest.Use, Member> tuple) {
        ShareLink sl = shareLinkMapper.selectById(tuple.getT1().getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 링크가 존재하지 않습니다."));
        sl.setUse(tuple.getT1().isUse());
        shareLinkMapper.updateUse(sl);

        return sl;
    }



}
