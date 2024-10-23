package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.Board;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardMapper {

    List<Board> findAllByIsUse();
}
