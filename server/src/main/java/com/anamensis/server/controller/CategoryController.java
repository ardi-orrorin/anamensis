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

@RestController
@RequestMapping("api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("")
    public Mono<CategoryResponse.Result<Category>> insertCategory(
            @Valid @RequestBody CategoryRequest.Create category
    ) {
        Category newCategory = new Category(0, category.getName(), category.getParentId(), true);

        return categoryService.insert(newCategory)
                .map(result ->  {
                    HttpStatus status = result ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
                    String message = result ? "Created" : "Bad Request";
                    return CategoryResponse.Result.transToCategory(newCategory, status, message);
                });
    }

    @PutMapping("")
    public Mono<CategoryResponse.Result<Category>> updateCategory(
            @RequestBody @Valid CategoryRequest.Update category
    ) {
        Category prevCategory = new Category(category.getId(), category.getName(), category.getParentId(), true);

        return categoryService.update(prevCategory)
                .map(result -> {
                    HttpStatus status = result ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
                    String message = result ? "ok" : "Bad Request";
                    return CategoryResponse.Result.transToCategory(prevCategory, status, message);
                });
    }

    @DeleteMapping("{id}")
    public Mono<CategoryResponse.Result<Long>> deleteCategory(
            @PathVariable long id
    ) {
        return categoryService.delete(id)
                .map(result -> {
                    HttpStatus status = result ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
                    String message = result ? "Deleted" : "Bad Request";
                    return CategoryResponse.Result.transToDelete(id, status, message);
                });
    }
}
