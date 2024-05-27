package com.anamensis.server.mapper;


import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import com.anamensis.server.resultMap.MemberResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MemberMapper {

    List<Member> findAllMember();

    Optional<Member> findMemberByUserId(String userId);

    Optional<MemberResultMap> findMemberInfo(String userId);

    int editAuth(
            @Param("id") long id,
            @Param("isAuth") boolean isAuth,
            @Param("authType") AuthType authType);

    void updatePoint(
            @Param("id") long id,
            @Param("point") int point
    );

    boolean existsMember(UserRequest.existsMember existsMember);

    int save(Member member);

    int saveRole(Role role);

    int deleteRole(Role role);

    int update(Member member);
}