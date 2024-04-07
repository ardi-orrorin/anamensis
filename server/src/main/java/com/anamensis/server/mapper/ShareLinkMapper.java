package com.anamensis.server.mapper;

import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface ShareLinkMapper {

    int insert(ShareLink shareLink);

    Optional<ShareLink> selectByShareLink(String shareLink);

    Optional<ShareLink> selectById(long id);

    int updateUse(ShareLink shareLink);


}
