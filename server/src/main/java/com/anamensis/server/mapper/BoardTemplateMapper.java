package com.anamensis.server.mapper;

import com.anamensis.server.entity.BoardTemplate;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardTemplateMapper {

    List<BoardTemplate> findAll(long memberPk);

    Optional<BoardTemplate> findById(long id);

    int save(BoardTemplate boardTemplate);

    int update(BoardTemplate boardTemplate);

    int disabled(long id, long memberPk);
}
