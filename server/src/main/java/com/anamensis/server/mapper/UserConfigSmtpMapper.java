package com.anamensis.server.mapper;

import com.anamensis.server.entity.UserConfigSmtp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserConfigSmtpMapper {

    Optional<UserConfigSmtp> selectById(long id);

    List<UserConfigSmtp> selectByUserPk(long userPk);

    Optional<UserConfigSmtp> selectFirstId(long userPk);

    boolean isDefault(
            @Param("id") long id,
            @Param("userPk") long userPk
    );

    void save(UserConfigSmtp userConfigSmtp);

    int update(UserConfigSmtp userConfigSmtp);

    int updateDefaultInit(long userPk);

    void disabled(
        @Param("id") long id,
        @Param("userPk") long userPk
    );



    void deleteByUserPk(long userPk);

    void deleteById(long id);
}
