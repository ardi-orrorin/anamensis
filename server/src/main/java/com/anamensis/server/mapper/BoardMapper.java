package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.Board;
import com.anamensis.server.resultMap.BoardResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {
    int save(Board board);

    List<BoardResultMap.Board> findList(
        @Param("page") Page page,
        @Param("board") Board board
    );

    Optional<BoardResultMap.Board> findByPk(long boardPk);

    long count(Board board);

    int disableByPk(long boardPk, long userPk);

    int viewUpdateByPk(long boardPk);

    int updateByPk(Board board);
}
