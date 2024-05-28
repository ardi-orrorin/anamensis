package com.anamensis.server.mapper;

import com.anamensis.server.entity.MemberConfigSmtp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MemberConfigSmtpMapper {

    Optional<MemberConfigSmtp> selectById(long id);

    List<MemberConfigSmtp> selectByMemberPk(long memberPk);

    Optional<MemberConfigSmtp> selectFirstId(long memberPk);

    boolean isDefault(
            @Param("id") long id,
            @Param("memberPk") long memberPk
    );

    void save(MemberConfigSmtp memberConfigSmtp);

    int update(MemberConfigSmtp memberConfigSmtp);

    int disabledDefaults(long memberPk);

    void disabled(
        @Param("id") long id,
        @Param("memberPk") long memberPk
    );

}
