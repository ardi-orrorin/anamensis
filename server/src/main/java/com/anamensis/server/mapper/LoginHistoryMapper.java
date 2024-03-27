package com.anamensis.server.mapper;

import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LoginHistoryMapper {

    int save(
        @Param("history") LoginHistory loginHistory,
        @Param("user") User user
    );
}
