package com.anamensis.server.service;

import com.anamensis.server.entity.Category;
import com.anamensis.server.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryMapper categoryMapper;

    public Mono<List<Category>> selectAll() {
        return Mono.fromCallable(categoryMapper::selectAll);
    }

    public Mono<Boolean> insert(Category category) {
        return Mono.fromCallable(() ->
                        categoryMapper.insert(category) == 1
                    )
                    .onErrorReturn(false);
    }

    public Mono<Boolean> update(Category category) {
        return Mono.fromCallable(()->
                        categoryMapper.update(category) == 1
                    )
                    .onErrorReturn(false);
    }

    public Mono<Boolean> delete(long id) {
        return Mono.fromCallable(() ->
                        categoryMapper.delete(id) == 1
                    )
                    .onErrorReturn(false);
    }
}
