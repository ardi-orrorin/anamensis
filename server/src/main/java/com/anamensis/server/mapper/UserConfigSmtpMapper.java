package com.anamensis.server.mapper;

import com.anamensis.server.entity.UserConfigSmtp;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserConfigSmtpMapper {

    Optional<UserConfigSmtp> selectById(long id);

    List<UserConfigSmtp> selectByUserPk(long userPk);

    void save(UserConfigSmtp userConfigSmtp);

    int update(UserConfigSmtp userConfigSmtp);

    void deleteByUserPk(long userPk);

    void deleteById(long id);
}