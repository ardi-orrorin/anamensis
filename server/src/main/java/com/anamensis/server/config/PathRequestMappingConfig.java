package com.anamensis.server.config;

import com.anamensis.server.controller.PublicAPI;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.result.method.RequestMappingInfo;
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;
import java.util.Set;

@Slf4j
public class PathRequestMappingConfig extends RequestMappingHandlerMapping {

    @Override
    protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {

        RequestMappingInfo requestMappingInfo = super.getMappingForMethod(method, handlerType);

        if(method.getAnnotation(PublicAPI.class) != null) {
            Set<String> paths = requestMappingInfo.getDirectPaths();

            String path = String.join("/", paths);

            RequestMappingInfo.Builder builder = RequestMappingInfo.paths("public" + path);

            log.info("Public API: {}", builder.build().getDirectPaths());

            return builder.build();
        }

        return super.getMappingForMethod(method, handlerType);
    }
}
