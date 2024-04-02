package com.anamensis.server.service;

import com.anamensis.server.entity.Category;
import com.anamensis.server.mapper.CategoryMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CategoryServiceTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(CategoryServiceTest.class);

    @SpyBean
    private CategoryService categoryService;

    @SpyBean
    private CategoryMapper categoryMapper;

    Category category = new Category();

    @BeforeEach
    void setUp() {
        category.setId(5);
        category.setName("main-category-master");
//        category.setParentPK(5L);
        category.setUse(true);
    }

    @Test
    void selectAll() {
        log.info("{}", categoryMapper.selectAll());
    }

    @Test
    void insert() {
        categoryMapper.insert(category);
    }

    @Test
    void update() {
        categoryMapper.update(category);
    }

    @Test
    void delete() {
        categoryMapper.delete(5);
    }
}