package com.anamensis.server.controller;

import com.anamensis.server.entity.Category;
import com.anamensis.server.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("")
    public Mono<List<Category>> getAllCategories() {
        return Mono.just(categoryService.selectAll());
    }

    @PostMapping("")
    public Mono<Boolean> insertCategory(@RequestBody Mono<Category> category) {
        return category.map(categoryService::insert);
    }

    @PutMapping("")
    public Mono<Boolean> updateCategory(@RequestBody Mono<Category> category) {
        return category.map(categoryService::update);
    }

    @DeleteMapping("")
    public Mono<Boolean> deleteCategory(@RequestParam Mono<Integer> id) {
        return id.map(categoryService::delete);
    }
}
