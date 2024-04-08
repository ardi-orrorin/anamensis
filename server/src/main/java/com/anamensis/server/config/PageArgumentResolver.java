package com.anamensis.server.config;

import com.anamensis.server.dto.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.BindingContext;
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Slf4j
public class PageArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType() == Page.class;
    }

    @Override
    public Mono<Object> resolveArgument(
            MethodParameter parameter,
            BindingContext bindingContext,
            ServerWebExchange exchange
    ) {
        MultiValueMap<String, String> params = exchange.getRequest().getQueryParams();

        Page page = new Page();
        page.setPage(Integer.parseInt(Objects.requireNonNull(params.getFirst("page"))));
        page.setLimit(Integer.parseInt(Objects.requireNonNull(params.getFirst("limit"))));
        page.setCriteria(params.getFirst("criteria"));
        page.setOrder(params.getFirst("order"));

        return Mono.just(page);
    }
}
