package com.anamensis.server.provider;

import com.anamensis.server.service.UserService;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
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

    @Autowired
    @Lazy
    private UserService userService;

    @Value("${jwt.grant-type}")
    private String GRANT_TYPE;

    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public String generateToken(String userId) {
        Instant now = Instant.now().plusSeconds(1 * 60 * 60);
        return Jwts.builder()
                .setSubject(userId)
                .setExpiration(Timestamp.from(now))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String getUserId(String token) {
        JwtParser jwts =  Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build();
        return jwts.parseClaimsJws(token.substring(7))
                .getBody().getSubject();

    }

    public Mono<Authentication> getAuthentication(String token) {
        log.info("getAuthentication : {}", token);
        return userService.findByUsername(getUserId(token))
                .map(userDetails -> new UsernamePasswordAuthenticationToken(userDetails, ""));
    }

}
