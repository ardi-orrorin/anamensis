package com.anamensis.server.service;

import com.anamensis.server.entity.Category;
import com.anamensis.server.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    public List<Category> selectAll() {
        return categoryMapper.selectAll();
    }

    @Transactional
    public boolean insert(Category category) {
        int result = categoryMapper.insert(category);

        return result == 1;
    }

    @Transactional
    public boolean update(Category category) {
        int result = categoryMapper.update(category);

        return result == 1;
    }

    @Transactional
    public boolean delete(long id) {
        int result = categoryMapper.delete(id);
        return result == 1;
    }
}
