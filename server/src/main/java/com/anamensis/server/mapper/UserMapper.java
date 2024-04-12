package com.anamensis.server.mapper;


import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.User;
import com.anamensis.server.resultMap.UserResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {

    List<User> findAllUsers();

    Optional<User> findUserByUserId(String userId);

    Optional<UserResultMap> findUserInfo(String userId);

    boolean existsUser(UserRequest.existsUser existsUser);

    int save(User user);

    int saveRole(Role role);

    int deleteRole(Role role);
}