package com.loan.loanofficerservice.service.implementation;

import com.loan.loanofficerservice.service.abstraction.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtServiceImpl(
            @Value("${jwt.secret}") String privateKey,
            @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(privateKey)
        );
        this.expirationMs = expirationMs;
    }

    @Override
    public String generateToken(String officerEmail) {
        JwtBuilder jwtBuilder = Jwts.builder();

        return jwtBuilder
                .subject(officerEmail)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(
                        System.currentTimeMillis()+expirationMs
                ))
                .signWith(secretKey)
                .compact();
    }

    @Override
    public String extractOfficerEmail(String token) {
        return extractClaims(token).getSubject();
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = extractClaims(token);

            return claims.getExpiration().after(new Date())
                    && claims.getSubject()
                    .equals(userDetails.getUsername());
        } catch (Exception exception) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        JwtParser jwtParser = Jwts.parser()
                .verifyWith(secretKey)
                .build();

        return jwtParser
                .parseSignedClaims(token)
                .getPayload();
    }
}