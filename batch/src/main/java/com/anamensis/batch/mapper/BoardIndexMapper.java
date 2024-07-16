package com.anamensis.batch.mapper;

import com.anamensis.batch.entity.BoardIndex;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardIndexMapper {

    int save(BoardIndex boardIndex);

    int delete(long boardId);

    void deleteAll();
}
