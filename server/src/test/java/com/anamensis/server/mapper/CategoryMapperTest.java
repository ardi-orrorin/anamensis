package com.anamensis.server.mapper;

import com.anamensis.server.entity.Category;
import jakarta.validation.constraints.DecimalMax;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class CategoryMapperTest {

    @SpyBean
    CategoryMapper cm;

    @Test
    @Order(1)
    @DisplayName("카테고리 생성")
    void insert() {
        Category c = new Category();
        c.setName("test");
        c.setUse(true);
        assertDoesNotThrow(()->cm.insert(c));

        c.setName("test2");
        c.setParentPK(1L);
        assertDoesNotThrow(()->cm.insert(c));

        assertThrows(DataIntegrityViolationException.class,() -> cm.insert(c));

        c.setName("test3");
        c.setParentPK(100L);
        assertThrows(DataIntegrityViolationException.class,() -> cm.insert(c));
    }

    @Test
    @Order(2)
    @DisplayName("카테고리 전체 조회")
    void selectAll() {
        List<Category> categories = cm.selectAll();
        assertFalse(categories.isEmpty());
        assertEquals(8, categories.size());

        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-1")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-2")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-3")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-4")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-5")));
        assertFalse(categories.stream().anyMatch(c->c.getName().equals("category-6")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-7")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-8")));
        assertFalse(categories.stream().anyMatch(c->c.getName().equals("category-9")));
        assertTrue(categories.stream().anyMatch(c->c.getName().equals("category-10")));
        assertFalse(categories.stream().anyMatch(c->c.getName().equals("category-11")));
        assertFalse(categories.stream().anyMatch(c->c.getName().equals("category-12")));
    }

    @Test
    @Order(3)
    @DisplayName("카테고리 조회")
    void selectById() {
        Optional<Category> c1 = cm.selectById(1);
        assertTrue(c1.isPresent());
        assertDoesNotThrow(() -> c1.get());
        assertEquals("category-1", c1.get().getName());

        Optional<Category> c2 = cm.selectById(100);
        assertFalse(c2.isPresent());
        assertThrows(NoSuchElementException.class,()-> c2.get());
    }

    @Test
    @Order(4)
    @DisplayName("카테고리 수정")
    void update() {
        Optional<Category> c1 = cm.selectById(1);
        assertTrue(c1.isPresent());
        assertDoesNotThrow(() -> c1.get());
        assertEquals("category-1", c1.get().getName());
        assertTrue(c1.get().isUse());

        c1.get().setName("category-1-1");
        assertEquals(1, cm.update(c1.get()));

        Optional<Category> c2 = cm.selectById(1);
        assertTrue(c2.isPresent());
        assertDoesNotThrow(() -> c2.get());
        assertEquals("category-1-1", c2.get().getName());
        assertTrue(c2.get().isUse());
    }

    @Test
    @Order(5)
    @DisplayName("카테고리 삭제")
    void delete() {
        Optional<Category> c1 = cm.selectById(1);
        assertTrue(c1.isPresent());
        assertDoesNotThrow(() -> c1.get());
        assertEquals("category-1", c1.get().getName());
        assertTrue(c1.get().isUse());

        assertThrowsExactly(DataIntegrityViolationException.class,()-> cm.delete(1));


        Optional<Category> c2 = cm.selectById(10);
        assertTrue(c2.isPresent());
        assertDoesNotThrow(() -> c2.get());
        assertDoesNotThrow(()-> cm.delete(10));

        Optional<Category> c3 = cm.selectById(10);
        assertFalse(c3.isPresent());
        assertThrows(NoSuchElementException.class,()-> c3.get());
    }

    @Test
    @Order(6)
    @DisplayName("이름 255자 제한 테스트")
    void nameLengthTest() {
        Category c = new Category();
        c.setName("a".repeat(255));
        c.setUse(true);
        assertDoesNotThrow(()->cm.insert(c));

        c.setName("a".repeat(256));
        assertThrows(DataIntegrityViolationException.class,() -> cm.insert(c));
    }


}