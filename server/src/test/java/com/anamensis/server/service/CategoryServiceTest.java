package com.anamensis.server.service;

import com.anamensis.server.entity.Category;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.ImportRuntimeHints;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class CategoryServiceTest {

    @SpyBean
    CategoryService cs;

    Logger log = org.slf4j.LoggerFactory.getLogger(CategoryServiceTest.class);

    @Test
    @Order(1)
    @DisplayName("모든 카테고리 조회 테스트")
    void selectAll() {
        StepVerifier.create(cs.selectAll())
                .assertNext(list -> {
                    assertEquals(8, list.size());
                })
                .verifyComplete();
    }

    @Test
    @Order(2)
    @DisplayName("카테고리 추가 테스트")
    void insert() {

        Category c1 = new Category();
        c1.setName("category-11");
        StepVerifier.create(cs.insert(c1))
                .expectNext(true)
                .verifyComplete();

        Category c2 = new Category();
        c2.setName("category-10");
        StepVerifier.create(cs.insert(c2))
                .expectNext(false)
                .verifyComplete();

        StepVerifier.create(cs.insert(null))
                .expectNext(false)
                .verifyComplete();

        c2.setName(null);
        StepVerifier.create(cs.insert(c2))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Order(3)
    @DisplayName("카테고리 수정 테스트")
    void update() {
        Category c1 = new Category();
        c1.setId(1);
        c1.setName("category-1");

        StepVerifier.create(cs.update(c1))
                .expectNext(true)
                .verifyComplete();

        Category c2 = new Category();
        c2.setId(10);
        c2.setName("category-100");

        StepVerifier.create(cs.update(c2))
                .expectNext(true)
                .verifyComplete();

        StepVerifier.create(cs.update(null))
                .expectNext(false)
                .verifyComplete();

        c2.setId(0);
        StepVerifier.create(cs.update(c2))
                .expectNext(false)
                .verifyComplete();
    }

    @Test
    @Order(4)
    @DisplayName("카테고리 삭제 테스트")
    void delete() {

        StepVerifier.create(cs.delete(1))
                    .expectNext(false)
                    .verifyComplete();

        StepVerifier.create(cs.selectAll())
                    .assertNext(list -> {
                        assertEquals(8, list.size());
                    })
                    .verifyComplete();

        StepVerifier.create(cs.delete(10))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(cs.selectAll())
                    .assertNext(list -> {
                        assertEquals(7, list.size());
                    })
                    .verifyComplete();


        StepVerifier.create(cs.delete(9))
                    .expectNext(true)
                    .verifyComplete();

        StepVerifier.create(cs.selectAll())
                    .assertNext(list -> {
                        assertEquals(7, list.size());
                    })
                    .verifyComplete();

        StepVerifier.create(cs.delete(0))
                    .expectNext(false)
                    .verifyComplete();

        StepVerifier.create(cs.delete(0))
                    .expectNext(false)
                    .verifyComplete();

        StepVerifier.create(cs.delete(100))
                    .expectNext(false)
                    .verifyComplete();
    }
}