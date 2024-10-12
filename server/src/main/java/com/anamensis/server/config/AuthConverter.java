package com.anamensis.server.config;

import com.anamensis.server.provider.TokenProvider;
import com.anamensis.server.service.UserService;
import com.anamensis.server.websocket.handler.ChatHandler;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthConverter implements ServerAuthenticationConverter {

    private final TokenProvider tokenProvider;

    private final UserService userService;

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        HttpHeaders headers = exchange.getRequest().getHeaders();
        String auth = headers.getFirst("Authorization");
        String cookie = headers.getFirst("Cookie");

        if(auth != null && auth.startsWith("Bearer ")) {
            auth =  auth.substring(7);
            return isValidateToken(auth, exchange);
        } else if(cookie != null && cookie.startsWith("next.access.token=")) {
            String accessCookieName = "next.access.token";
            String refreshCookieName = "next.refresh.token";

            String[] cookies = cookie.split(";");
            String accessToken = Arrays.stream(cookies).filter(c -> c.contains(accessCookieName)).findFirst().orElse("");
            String refreshToken = Arrays.stream(cookies).filter(c -> c.contains(refreshCookieName)).findFirst().orElse("");


            if(!accessToken.isEmpty()) {
                return isValidateToken(accessToken.split("=")[1], exchange);
            } else if(!refreshToken.isEmpty()) {
                return isValidateToken(refreshToken.split("=")[1], exchange);
            }

        }
        return Mono.empty();
    }

    public Mono<Authentication> isValidateToken(String token, ServerWebExchange exchange) {
        Claims claims = tokenProvider.getClaims(token);
        String userId = claims.get("user", String.class);
        if(claims.get("type").equals("refresh")) {
            ResponseCookie cookie = ResponseCookie.from("next.access.token", tokenProvider.generateToken(userId, true))
                    .maxAge(tokenProvider.ACCESS_EXP)
                    .build();

            exchange.getResponse().addCookie(cookie);
        }

        return userService.findByUsername(userId)
                .onErrorMap(e -> new RuntimeException("유저 정보가 없습니다."))
                .map(u -> new UsernamePasswordAuthenticationToken(u, token, u.getAuthorities()));
    }
}
