package com.anamensis.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;

@Configuration
@EnableWebFlux
@EnableWebFluxSecurity
public class Security {

    @Bean
    public SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http) {
        http.authorizeExchange((authorize) -> authorize
                .pathMatchers("/**").permitAll()
//                .pathMatchers("/resources/**", "/signup", "/about").permitAll()
//                .pathMatchers("/admin/**").hasRole("ADMIN")
		);


        http.formLogin(ServerHttpSecurity.FormLoginSpec::disable);
        http.csrf(ServerHttpSecurity.CsrfSpec::disable);

        http.httpBasic(Customizer.withDefaults());

        http.cors(cors -> cors.configurationSource(this::corsConfiguration));

        return http.build();
    }

//    @Bean
//    public MapReactiveUserDetailsService userDetailsService() {
//        return new MapReactiveUserDetailsService();
//    }

    private CorsConfiguration corsConfiguration(ServerWebExchange exchange){

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("*"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        return corsConfiguration;
    }
}
