package com.anamensis.server.provider;

import com.anamensis.server.entity.AuthType;
import io.jsonwebtoken.Claims;
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

    // 시 * 분 * 초 * 밀리초
    public final long ACCESS_EXP  =  1 * 30 * 60 * 1000;
    public final long REFRESH_EXP = 24 * 60 * 60 * 1000;

    public final long TEMP_EXP = 5 * 60 * 1000;

    public String tempToken(String userId) {
        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        String type = AuthType.OTP.name();
        Claims claims = Jwts.claims();
        claims.put("user", userId);
        claims.put("type", type);
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(
                        new Timestamp(Instant.now().toEpochMilli() + TEMP_EXP)
                )
                .signWith(SECRET_KEY)
                .compact();
    }

    public String generateToken(String userId, boolean isRefresh) {
        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        long exp = isRefresh ? REFRESH_EXP : ACCESS_EXP;
        String type = isRefresh ? "refresh" : "access";
        Claims claims = Jwts.claims();
        claims.put("user", userId);
        claims.put("type", type);

        return Jwts.builder()
            .setClaims(claims)
            .setExpiration(
                new Timestamp(Instant.now().toEpochMilli() + exp)
            )
            .signWith(SECRET_KEY)
            .compact();
    }

    public Claims getClaims(String token){
        SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        JwtParser jwts =  Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build();
        return jwts.parseClaimsJws(token)
                .getBody();
    }
}
