package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.entity.BoardComment;
import com.anamensis.server.resultMap.BoardCommentResultMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardCommentMapper {

    List<BoardCommentResultMap.List> findAllByBoardPk(
        long boardPk,
        Page page
    );

    int save(BoardComment boardComment);

    int delete(long id, String userId);

    Optional<BoardComment> findById(long id);

    int count(long boardPk);
}
