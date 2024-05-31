package com.anamensis.server.controller;

import com.anamensis.server.dto.request.CategoryRequest;
import com.anamensis.server.dto.response.CategoryResponse;
import com.anamensis.server.entity.Category;
import com.anamensis.server.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@RestController
@RequestMapping("api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

//    @GetMapping("")
//    public Mono<CategoryResponse.Result<List<Category>>> getAllCategories() {
//
//        return Mono.just(categoryService.selectAll())
//                .map(result -> CategoryResponse.Result.<List<Category>>builder()
//                        .body(result)
//                        .status(HttpStatus.OK)
//                        .message("OK")
//                        .build()
//                );
//    }

    @PostMapping("")
    public Mono<CategoryResponse.Result<Category>> insertCategory(
            @RequestBody @Valid Mono<CategoryRequest.Create> category
    ) {
        return category
                .map(create ->
                        new Category(0, create.getName(), create.getParentId(), true)
                )
                .doOnNext(categoryService::insert)
                .map(result ->  CategoryResponse.Result.transToCategory(
                        result, HttpStatus.CREATED, "Created")
                );
    }

    @PutMapping("")
    public Mono<CategoryResponse.Result<Category>> updateCategory(
            @RequestBody @Valid Mono<CategoryRequest.Update> category
    ) {
        return category
                .map(update ->
                        new Category(update.getId(), update.getName(), update.getParentId(), true)
                )
                .doOnNext(categoryService::update)
                .map(result -> CategoryResponse.Result.transToCategory(
                        result, HttpStatus.OK, "Updated")
                );
    }

    @DeleteMapping("{id}")
    public Mono<CategoryResponse.Result<Long>> deleteCategory(
            @PathVariable long id
    ) {
        return Mono.just(id)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(categoryService::delete)
                .map(idx -> CategoryResponse.Result.transToDelete(
                        idx, HttpStatus.OK, "Deleted")
                );
    }
}
