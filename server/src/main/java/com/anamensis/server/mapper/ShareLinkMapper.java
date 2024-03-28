package com.anamensis.server.mapper;

import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface ShareLinkMapper {

    int insert(
        @Param("shareLink") ShareLink shareLink,
        @Param("user") User user
    );

    Optional<ShareLink> selectByShareLink(String shareLink);

    int updateUse(ShareLink shareLink);


}
