package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PointCodeMapper {

    List<PointCode> selectAll();

    List<PointCode> selectByIdOrName(PointCode pointCode);

    Optional<PointCode> findByName(String name);

    int insert(PointCode pointCode);

    int update(PointCode pointCode);
}
