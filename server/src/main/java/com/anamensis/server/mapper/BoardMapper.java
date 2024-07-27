package com.anamensis.server.mapper;

import com.anamensis.server.dto.Page;
import com.anamensis.server.dto.request.BoardRequest;
import com.anamensis.server.entity.Board;
import com.anamensis.server.entity.Member;
import com.anamensis.server.resultMap.BoardResultMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {
    int save(Board board);

    List<BoardResultMap.List> findList(
        @Param("page") Page page,
        @Param("params") BoardRequest.Params params,
        @Param("member") Member member
    );

    List<BoardResultMap.List> findIsSelf(
        @Param("page") Page page,
        @Param("params") BoardRequest.Params params,
        @Param("member") Member member
    );

    Optional<BoardResultMap.Board> findByPk(long boardPk);

    List<BoardResultMap.Board> findByMemberPk(
        @Param("memberPk") long memberPk,
        @Param("page") Page page
    );


    List<BoardResultMap.Notice> findNotice();

    long count(Board board);

    int disableByPk(
        long boardPk,
        long memberPk,
        LocalDateTime updateAt
    );

    int viewUpdateByPk(long boardPk);

    int updateByPk(Board board);
}
