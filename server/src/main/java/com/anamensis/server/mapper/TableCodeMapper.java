package com.anamensis.server.mapper;

import com.anamensis.server.entity.TableCode;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface TableCodeMapper {


    Optional<TableCode> findByIdByTableName(long id, String tableName);
    int save(TableCode tableCode);

    int update(TableCode tableCode);

    int deleteByIdOrTableName(long id, String tableName);

}
