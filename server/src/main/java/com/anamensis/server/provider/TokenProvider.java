package com.anamensis.server.provider;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class TokenProvider {

    @Value("${jwt.grant-type}")
    private String GRANT_TYPE;

    private SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .signWith(secretKey)
                .compact();
    }

}
