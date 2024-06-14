package com.anamensis.server.config;

import com.anamensis.server.dto.Device;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.web.reactive.BindingContext;
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Slf4j
public class DeviceResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter
                .getParameterType()
                .equals(Device.class);
    }

    @Override
    public Mono<Object> resolveArgument(
            MethodParameter parameter,
            BindingContext bindingContext,
            ServerWebExchange exchange
    ) {
        Device device = new Device(
            exchange.getRequest().getHeaders().getFirst("Ip"),
            exchange.getRequest().getHeaders().getFirst("Location"),
            exchange.getRequest().getHeaders().getFirst("User-Agent")
        );

        return Mono.just(device);
    }
}
