package com.anamensis.server.mapper;

import com.anamensis.server.entity.SystemMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface SystemMessageMapper {

    Optional<SystemMessage> findById(int id);

    List<SystemMessage> findByWebSysPk(String webSysPk);

    void save(SystemMessage systemMessage);

    int update(SystemMessage systemMessage);

    int updateIsUse(
            @Param("id") int id,
            @Param("isUse") boolean isUse,
            @Param("updateAt") LocalDateTime updateAt
    );

    int delete(int id);

}
