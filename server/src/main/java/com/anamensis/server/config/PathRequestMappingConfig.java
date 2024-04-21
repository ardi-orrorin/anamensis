package com.anamensis.server.config;

import com.anamensis.server.controller.PublicAPI;
import org.springframework.web.reactive.result.method.RequestMappingInfo;
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;

public class PathRequestMappingConfig extends RequestMappingHandlerMapping {

    @Override
    protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {
        if(method.getAnnotation(PublicAPI.class) == null) return super.getMappingForMethod(method, handlerType);

        RequestMappingInfo requestMappingInfo = super.getMappingForMethod(method, handlerType);

        if(requestMappingInfo != null && method.getAnnotation(PublicAPI.class) != null) {
            return RequestMappingInfo.paths("public")
                    .build()
                    .combine(requestMappingInfo);
        }

        return requestMappingInfo;
    }
}
