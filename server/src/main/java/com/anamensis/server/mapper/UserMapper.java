package com.anamensis.server.mapper;


import com.anamensis.server.entity.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {

    List<User> findAllUsers();

    User findUserByUserId(String userId);

    Optional<User> findUserByUserIdAndPwd(String userId, String pwd);
}
