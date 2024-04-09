package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LoginHistoryMapper {

    int count(long userId);

    List<LoginHistory> selectAll(
            @Param("user") User user,
            @Param("page") Page page
    );

    int save(
        @Param("history") LoginHistory loginHistory,
        @Param("user") User user
    );
}
