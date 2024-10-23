package com.anamensis.server.mapper;

import com.anamensis.server.entity.BoardIndex;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardIndexMapper {

    int save(BoardIndex boardIndex);

    int update(BoardIndex boardIndex);

    int delete(long boardId);

    void deleteAll();
}
