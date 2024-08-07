package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.LoginHistory;
import com.anamensis.server.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LoginHistoryMapper {

    int count(long memberPk);

    List<LoginHistory> selectAll(
            @Param("member") Member member,
            @Param("page") Page page
    );

    int save(
        @Param("history") LoginHistory loginHistory,
        @Param("member") Member member
    );

    boolean exist(
        @Param("memberPk") long memberPk,
        @Param("ip") String ip,
        @Param("device") String device
    );

}
