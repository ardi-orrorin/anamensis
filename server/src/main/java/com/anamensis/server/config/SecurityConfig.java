package com.anamensis.server.config;

import com.anamensis.server.config.converter.StringToAuthTypeConverter;
import com.anamensis.server.config.converter.StringToRoleTypeConverter;
import com.anamensis.server.service.GoogleUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.AuthorizeExchangeSpec;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.config.web.server.ServerHttpSecurity.FormLoginSpec;
import org.springframework.security.config.web.server.ServerHttpSecurity.HttpBasicSpec;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcReactiveOAuth2UserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.userinfo.ReactiveOAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;
import reactor.core.publisher.Mono;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
@EnableWebFlux
@EnableWebFluxSecurity
@Slf4j
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
                .cors(corsSpec -> {
                    corsSpec.configurationSource(corsConfigurationSource());
                })
                .oauth2Login(Customizer.withDefaults())
                .addFilterBefore(
                        authenticationWebFilter,
                        SecurityWebFiltersOrder.AUTHENTICATION
                )
                .build();
    }

    private AuthorizeExchangeSpec authorizeExchange(AuthorizeExchangeSpec exchange) {
        return exchange
                .pathMatchers("/public/**", "/actuator/**","/login/**").permitAll()
                .pathMatchers("/api/**").hasAuthority("USER")
                .pathMatchers("/admin/**").hasAuthority("ADMIN")
                .anyExchange().authenticated();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return (request) -> {
            CorsConfiguration corsConfiguration = new CorsConfiguration();
//            corsConfiguration.setAllowedOriginPatterns(List.of("*"));
//            corsConfiguration.setAllowedOriginPatterns(List.of("http://192.168.0.49:8080", "http://192.168.0.49:3000", "http://localhost:8080", "http://localhost:3000"));
            corsConfiguration.setAllowedOrigins(List.of("http://192.168.0.49:8080", "http://192.168.0.49:3000", "http://localhost:8080", "http://localhost:3000"));
            corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
            corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Device", "Location"));
            corsConfiguration.setAllowCredentials(true);
            corsConfiguration.setMaxAge(3600L);
            return corsConfiguration;
        };
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

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToRoleTypeConverter());
        registry.addConverter(new StringToAuthTypeConverter());

    }
}
