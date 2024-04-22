package com.anamensis.server.mapper;

import com.anamensis.server.entity.SystemMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface SystemMessageMapper {

    Optional<SystemMessage> findById(int id);

    List<SystemMessage> findByWebSysPk(String webSysPk);

    void save(SystemMessage systemMessage);

    void update(SystemMessage systemMessage);

    void updateIsUse(
            @Param("id") int id,
            @Param("isUse") boolean isUse
    );

    void delete(int id);

}
