package com.anamensis.server.mapper;

import com.anamensis.server.entity.BoardFavorite;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardFavoriteMapper {

    List<BoardFavorite> findAllByMemberPk(Long memberPk);

    boolean existFavorite(Long memberPk, Long boardPk);

    int save(BoardFavorite boardFavorite);

    int deleteByBoardPkAndMemberPk(Long boardPk, Long memberPk);

}
