package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.ShareLink;
import com.anamensis.server.entity.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ShareLinkMapper {

    int selectCount(Users users);

    List<ShareLink> selectAll(
            @Param("user") Users users,
            @Param("page") Page page
    );

    Optional<ShareLink> selectByShareLink(String shareLink);

    Optional<ShareLink> selectById(long id);

    int insert(ShareLink shareLink);

    int updateUse(ShareLink shareLink);


}
