package com.anamensis.server.dto.response;

import com.anamensis.server.dto.request.CategoryRequest;
import com.anamensis.server.entity.Category;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

import java.util.List;

public class CategoryResponse {
    @Builder
    @Getter
    @ToString
    public static class Result<T> {

        private T body;

        private HttpStatus status;

        private String message;

        public static Result<List<Category>> transToCategories(List<Category> categories, HttpStatus status, String message) {
            return Result.<List<Category>>builder()
                    .body(categories)
                    .status(status)
                    .message(message)
                    .build();
        }

        public static Result<Category> transToCategory(Category create, HttpStatus status, String message) {
            return Result.<Category>builder()
                    .body(create)
                    .status(status)
                    .message(message)
                    .build();
        }

        public static Result<Long> transToDelete(Long delete, HttpStatus status, String message) {
            return Result.<Long>builder()
                    .body(delete)
                    .status(status)
                    .message(message)
                    .build();
        }

    }
}
