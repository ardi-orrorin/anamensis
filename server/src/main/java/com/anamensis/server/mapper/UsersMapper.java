package com.anamensis.server.mapper;


import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.Users;
import com.anamensis.server.resultMap.UsersResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UsersMapper {

    List<Users> findAllUsers();

    Optional<Users> findUserByUserId(String userId);

    Optional<UsersResultMap> findUserInfo(String userId);

    int editAuth(
            @Param("id") long id,
            @Param("isAuth") boolean isAuth,
            @Param("authType") AuthType authType);

    void updatePoint(
            @Param("id") long id,
            @Param("point") int point
    );

    boolean existsUser(UserRequest.existsUser existsUser);

    int save(Users users);

    int saveRole(Role role);

    int deleteRole(Role role);

    int update(Users users);
}