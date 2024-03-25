package com.anamensis.server.provider;

import com.anamensis.server.service.UserService;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.sql.Timestamp;
import java.time.Instant;

@Component
@Slf4j
public class TokenProvider {

    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private final long EXP = 30 * 60 * 1000L;


    public String generateToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .setExpiration(new Timestamp(Instant.now().toEpochMilli() + EXP))
            .signWith(SECRET_KEY)
            .compact();
    }

    public String getUserId(String token) {
        JwtParser jwts =  Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build();
        return jwts.parseClaimsJws(token)
                .getBody().getSubject();

    }

}
