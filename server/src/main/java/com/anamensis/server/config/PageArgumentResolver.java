package com.anamensis.server.config;

import com.anamensis.server.dto.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.MethodParameter;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.BindingContext;
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
public class PageArgumentResolver implements HandlerMethodArgumentResolver {

    @Value("${pageable.page}")
    private String DEFAULT_PAGE;

    @Value("${pageable.size}")
    private String DEFAULT_SIZE;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(Page.class);
    }

    @Override
    public Mono<Object> resolveArgument(
            MethodParameter parameter,
            BindingContext bindingContext,
            ServerWebExchange exchange
    ) {
        MultiValueMap<String, String> params = exchange.getRequest().getQueryParams();

        String page = params.getFirst("page");
        String size = params.getFirst("size");
        String criteria = params.getFirst("criteria");
        String order = params.getFirst("order");
        String search = params.getFirst("search");
        String keyword = params.getFirst("keyword");
        String filterType = params.getFirst("filterType");
        String filterKeyword = params.getFirst("filterKeyword");

        Page query = new Page();

        query.setPage(Integer.parseInt(page == null ? DEFAULT_PAGE : page));
        query.setSize(Integer.parseInt(size == null ? DEFAULT_SIZE : size));
        query.setCriteria(criteria == null ? "id" : criteria);
        query.setOrder(order == null ? "desc" : order);
        query.setSearchType(search == null ? "" : search);
        query.setKeyword(keyword == null ? "" : keyword);
        query.setFilterKeyword(filterKeyword == null ? "" : filterKeyword);
        query.setFilterType(filterType == null ? "" : filterType);


        return Mono.just(query);
    }
}
