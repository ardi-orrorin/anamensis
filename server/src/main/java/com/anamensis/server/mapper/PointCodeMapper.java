package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PointCodeMapper {

    List<PointCode> selectAll();

    Optional<PointCode> selectByIdOrName(long id , String name);

    int insert(PointCode pointCode);

    int update(PointCode pointCode);

    int resetById(long id);

    int reset();
}
