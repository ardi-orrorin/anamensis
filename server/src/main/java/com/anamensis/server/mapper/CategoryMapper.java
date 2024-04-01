package com.anamensis.server.mapper;

import com.anamensis.server.entity.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CategoryMapper {

    List<Category> selectAll();

    Optional<Category> selectById(long id);

    int insert(Category category);

    int update(Category category);

    int delete(long id);


}
