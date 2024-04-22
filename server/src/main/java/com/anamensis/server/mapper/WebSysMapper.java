package com.anamensis.server.mapper;


import com.anamensis.server.entity.AuthType;
import com.anamensis.server.entity.Role;
import com.anamensis.server.entity.RoleType;
import com.anamensis.server.entity.WebSys;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface WebSysMapper {

    List<WebSys> findAll();

    Optional<WebSys> findByCode(String code);

    List<WebSys> findByPermission(RoleType permission);

    void save(WebSys webSys);

    void saveAll(List<WebSys> webSysList);

    void update(WebSys webSys);

    void deleteByCode(String code);
}
