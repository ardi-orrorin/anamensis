package com.anamensis.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.AuthorizeExchangeSpec;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.config.web.server.ServerHttpSecurity.FormLoginSpec;
import org.springframework.security.config.web.server.ServerHttpSecurity.HttpBasicSpec;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;

@Configuration
@EnableWebFlux
@EnableWebFluxSecurity
public class SecurityConfig implements WebFluxConfigurer {

    @Bean
    public SecurityWebFilterChain springWebFilterChain(
            ServerHttpSecurity http,
            ReactiveAuthenticationManager authenticationManager,
            AuthConverter authConverter
    ) {
        AuthenticationWebFilter authenticationWebFilter = new AuthenticationWebFilter(authenticationManager);
        authenticationWebFilter.setServerAuthenticationConverter(authConverter);

        return http
                .authorizeExchange(this::authorizeExchange)
                .formLogin(FormLoginSpec::disable)
                .httpBasic(HttpBasicSpec::disable)
                .csrf(CsrfSpec::disable)
                .addFilterAfter(
                        authenticationWebFilter,
                        SecurityWebFiltersOrder.AUTHENTICATION
                )
                .build();
    }

    private AuthorizeExchangeSpec authorizeExchange(AuthorizeExchangeSpec exchange) {
        return exchange
                .pathMatchers("/**").permitAll()
//                .pathMatchers("/api/**").authenticated()
                .anyExchange().authenticated();
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Device", "Location")
                .allowCredentials(true);
    }
    @Override
    public void configureArgumentResolvers(ArgumentResolverConfigurer configurer) {
        configurer.addCustomResolver(pageArgumentResolver());
        configurer.addCustomResolver(deviceResolver());
    }

    @Bean
    public PageArgumentResolver pageArgumentResolver() {
        return new PageArgumentResolver();
    }
    @Bean
    public DeviceResolver deviceResolver() {
        return new DeviceResolver();
    }
}
