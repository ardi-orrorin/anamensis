package com.anamensis.server.mapper;

import com.anamensis.server.entity.PointCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PointCodeMapper {

    List<PointCode> selectAll();

    List<PointCode> selectByIdOrName(PointCode pointCode);

    int insert(PointCode pointCode);

    int update(PointCode pointCode);
}
