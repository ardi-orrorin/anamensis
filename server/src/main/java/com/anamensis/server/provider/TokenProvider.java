package com.anamensis.server.provider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ClaimsBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.sql.Timestamp;
import java.time.Instant;

@Component
public class TokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey SECRET_KEY;

    // 일 * 시 * 분 * 초
    public final long ACCESS_EXP  =      24 * 60 * 60;
    public final long REFRESH_EXP = 30 * 24 * 60 * 60;

    public String generateToken(String userId, boolean isRefresh) {
        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        long exp = isRefresh ? REFRESH_EXP : ACCESS_EXP;
        String type = isRefresh ? "refresh" : "access";
        ClaimsBuilder claims = Jwts.claims();
        claims.add("user", userId);
        claims.add("type", type);

        return Jwts.builder()
            .claims(claims.build())
            .expiration(
                new Timestamp(Instant.now().toEpochMilli() + exp * 1000)
            )
            .signWith(SECRET_KEY)
            .compact();
    }

    public Claims getClaims(String token){
        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        JwtParser jwts =  Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build();
        return jwts.parseSignedClaims(token)
                .getPayload();
    }
}
