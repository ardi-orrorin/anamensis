package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LoginHistoryMapper {

    int count(long userId);

    List<LoginHistory> selectAll(
            @Param("user") Member users,
            @Param("page") Page page
    );

    int save(
        @Param("history") LoginHistory loginHistory,
        @Param("user") Member users
    );
}
