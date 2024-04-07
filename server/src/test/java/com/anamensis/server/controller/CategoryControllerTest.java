package com.anamensis.server.controller;

import com.anamensis.server.dto.request.CategoryRequest;
import com.anamensis.server.dto.response.CategoryResponse;
import com.anamensis.server.entity.Category;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CategoryControllerTest {

    @LocalServerPort
    int port;

    WebTestClient webTestClient;

    Logger log = org.slf4j.LoggerFactory.getLogger(CategoryControllerTest.class);


    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port + "/categories")
                .build();
    }

    @Test
    void getAllCategories() {
        EntityExchangeResult<CategoryResponse.Result> result =
        webTestClient.get()
                .uri("")
                .exchange()
                .expectStatus().isOk()
                .expectBody(CategoryResponse.Result.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());

    }

    @Test
    void insertCategory() {
        CategoryRequest.Create create = CategoryRequest.Create.builder()
//                .name(null)
//                .name("t")
                .name("test")
                .parentId(null)
                .build();
//        create.setName(null); error
//        create.setName("t"); error
//        create.setName("te"); // success
//        create.setParentId(null);

        EntityExchangeResult<CategoryResponse.Result> result =
        webTestClient.post()
                .uri("")
                .bodyValue(create)
                .exchange()
                .expectStatus().isOk()
                .expectBody(CategoryResponse.Result.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());

    }

    @Test
    void updateCategory() {
        CategoryRequest.Update update = CategoryRequest.Update.builder()
                .id(35)
                .name("test11111")
                .parentId(3L)
                .build();

        EntityExchangeResult<CategoryResponse.Result> result =
        webTestClient.put()
                .uri("")
                .bodyValue(update)
                .exchange()
                .expectStatus().isOk()
                .expectBody(CategoryResponse.Result.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());
    }

    @Test
    void deleteCategory() {
        EntityExchangeResult<CategoryResponse.Result> result =
        webTestClient.delete()
                .uri("/36")
                .exchange()
                .expectStatus().isOk()
                .expectBody(CategoryResponse.Result.class)
                .returnResult();

        log.info("result: {}", result.getResponseBody());
    }
}