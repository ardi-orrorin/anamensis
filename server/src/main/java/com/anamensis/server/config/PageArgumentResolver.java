package com.anamensis.server.config;

import com.anamensis.server.dto.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.BindingContext;
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

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

        log.info("params: {}", params);

        String page = params.getFirst("page");
        String size = params.getFirst("size");

        Page query = new Page();
        query.setPage(Integer.parseInt(page));
        query.setSize(Integer.parseInt(size));
        query.setCriteria(params.getFirst("criteria"));
        query.setOrder(params.getFirst("order"));

        return Mono.just(query);
    }
}
