package com.anamensis.server.config;

import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthConverter implements ServerAuthenticationConverter {

    private final TokenProvider tokenProvider;

    private final UserService userService;

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        return Mono.justOrEmpty(exchange)
                .map(ServerWebExchange::getRequest)
                .mapNotNull(request -> request.getHeaders().getFirst("Authorization"))
                .filter(authHeader -> authHeader != null && authHeader.startsWith("Bearer "))
                .map(authHeader -> authHeader.substring(7))
                .flatMap(this::isValidateToken);
    }


    public Mono<Authentication> isValidateToken(String token) {
        String userId = tokenProvider.getUserId(token);
        return userService.findByUsername(userId)
                .onErrorMap(e -> new RuntimeException("유저 정보가 없습니다."))
                .map(u -> new UsernamePasswordAuthenticationToken(u, token, u.getAuthorities()));
    }
}
