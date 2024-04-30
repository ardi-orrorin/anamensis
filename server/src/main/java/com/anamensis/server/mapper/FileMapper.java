package com.anamensis.server.mapper;

import com.anamensis.server.entity.File;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface FileMapper {
    int insert(File file);

    Optional<File> selectByFileName(String fileName);
}
