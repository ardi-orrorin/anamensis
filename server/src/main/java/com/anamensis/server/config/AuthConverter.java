package com.anamensis.server.config;

import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
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
                .doOnNext(authHeader -> {
                    if(authHeader == null || !authHeader.startsWith("Bearer ")) {
                        throw new MalformedJwtException("잘못된 토큰입니다.");
                    }
                })
                .map(authHeader -> authHeader.substring(7))
                .flatMap(token -> isValidateToken(token, exchange));
    }


    public Mono<Authentication> isValidateToken(String token, ServerWebExchange exchange) {
        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("user", String.class);
        if(claims.get("type").equals("refresh")) {
            ResponseCookie cookie = ResponseCookie.from("accessToken", tokenProvider.generateToken(userId, true))
                    .maxAge(tokenProvider.ACCESS_EXP / 1000)
                    .build();

            exchange.getResponse().addCookie(cookie);
        }

        return userService.findByUsername(userId)
                .onErrorMap(e -> new RuntimeException("유저 정보가 없습니다."))
                .map(u -> new UsernamePasswordAuthenticationToken(u, token, u.getAuthorities()));
    }
}
