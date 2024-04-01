package com.anamensis.server.mapper;

import com.anamensis.server.entity.Category;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CategoryMapperTest {

    @SpyBean
    private CategoryMapper categoryMapper;


    Logger log = org.slf4j.LoggerFactory.getLogger(CategoryMapperTest.class);

    Category category = new Category();

    @BeforeEach
    void setUp() {
        category.setId(1);
        category.setName("Test2");
        category.setParentPK(null);
    }

    @Test
    void selectAll() {
        log.info("{}", categoryMapper.selectAll());
    }

    @Test
    void selectById() {
        log.info("{}", categoryMapper.selectById(1));
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
        categoryMapper.delete(1);
    }
}