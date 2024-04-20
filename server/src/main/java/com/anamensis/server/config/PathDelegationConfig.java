package com.anamensis.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.accept.RequestedContentTypeResolver;
import org.springframework.web.reactive.config.DelegatingWebFluxConfiguration;
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping;


@Configuration
public class PathDelegationConfig extends DelegatingWebFluxConfiguration {
    @Override
    public RequestMappingHandlerMapping requestMappingHandlerMapping(RequestedContentTypeResolver contentTypeResolver) {
        return new PathRequestMappingConfig();
    }
}
