package com.anamensis.server.config;

import com.anamensis.server.dto.Device;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.web.reactive.BindingContext;
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

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

        exchange.getRequest().getHeaders();

        Device device = new Device();
        device.setDevice(exchange.getRequest().getHeaders().toString());
        return Mono.just(device);
    }
}
