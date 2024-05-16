package com.anamensis.server.mapper;

import com.anamensis.server.entity.File;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface FileMapper {
    int insert(File file);

    Optional<File> selectByFileName(String fileName);

    List<File> findByTableNameAndTableRefPk(
            @Param("tableName") String tableName,
            @Param("tableRefPk") long tableRefPk
    );

    int updateIsUseById(
            @Param("id") long id,
            @Param("isUse") int isUse
    );
}
