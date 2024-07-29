package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.BoardBlockHistory;
import com.anamensis.server.resultMap.BoardBlockHistoryResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardBlockHistoryMapper {

    long count(long memberPk);

    List<BoardBlockHistoryResultMap.ResultMap> findByAll(
        @Param("memberPk") long memberPk,
        @Param("page") Page page
    );

    Optional<BoardBlockHistoryResultMap.ResultMap> findByPk(long boardBlockHistoryPk);

    int save(BoardBlockHistory boardBlockHistory);

    int update(BoardBlockHistory boardBlockHistory);

    int deleteByPk(long pk);

}
