package com.anamensis.server.mapper;


import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.entity.AuthType;
import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.entity.Member;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.resultMap.MemberResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MemberMapper {

    long count(UserRequest.Params params);

    List<MemberResultMap> findAllMember(
        @Param("page") Page page,
        @Param("params") UserRequest.Params params
    );

    Optional<Member> findMemberByUserId(String userId);

    List<Member> findMemberByUserIds(List<String> userIds);

    Optional<MemberResultMap> findMemberInfo(String userId);

    Optional<Member> findMemberByEmailAndUserId(String email, String userId);

    int editAuth(
            @Param("id") long id,
            @Param("isAuth") boolean isAuth,
            @Param("authType") AuthType authType);

    int updatePoint(
            @Param("id") long id,
            @Param("point") long point
    );

    int subtractPoint(
            @Param("id") long id,
            @Param("point") long point
    );

    int updatePwd (
            @Param("userId") String userId,
            @Param("pwd") String pwd,
            @Param("email") String email
    );

    boolean existsMember(UserRequest.existsMember existsMember);

    int save(Member member);

    int saveRole(Role role);
    int saveRoles(
        @Param("ids") List<Long> ids,
        @Param("role") RoleType role
    );

    int update(Member member);

    int deleteRole(Role role);

    int deleteRoles(
        @Param("ids") List<Long> ids,
        @Param("role") RoleType role
    );

}