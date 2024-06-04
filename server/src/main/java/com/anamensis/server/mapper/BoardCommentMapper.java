package com.anamensis.server.mapper;

import com.anamensis.server.entity.BoardComment;
import com.anamensis.server.resultMap.BoardCommentResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardCommentMapper {

    List<BoardCommentResultMap.BoardComment> findAllByBoardPk(long boardPk);

    int save(BoardComment boardComment);
}
