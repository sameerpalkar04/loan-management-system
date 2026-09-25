package com.loan.authservice.service;

import com.loan.authservice.entity.UserRole;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
// Generates signed JWT access tokens for customer and officer identities.
public class JwtServiceImpl implements JwtService {

    private final SecretKey signingKey;
    private final long expirySeconds;
    private final String issuer;

    public JwtServiceImpl(
            @Value("${auth.jwt.secret}") String base64Secret,
            @Value("${auth.jwt.access-token-expiry-seconds:3600}") long expirySeconds,
            @Value("${auth.jwt.issuer:loan-auth-service}") String issuer) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
        this.expirySeconds = expirySeconds;
        this.issuer = issuer;
    }

    @Override
    // Creates a JWT that carries a customer identity.
    public String generateCustomerAccessToken(Long customerId) {
        return generateAccessToken(UserRole.CUSTOMER, customerId);
    }

    @Override
    // Creates a JWT that carries an officer identity.
    public String generateOfficerAccessToken(Long officerId) {
        return generateAccessToken(UserRole.LOAN_OFFICER, officerId);
    }

    // Builds the common signed token payload for either user role.
    private String generateAccessToken(UserRole role, Long profileId) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .issuer(issuer)
                .subject(role.name().toLowerCase() + ":" + profileId)
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expirySeconds)))
                .signWith(signingKey);

        if (role == UserRole.CUSTOMER) {
            builder.claim("customer_id", profileId);
        } else {
            builder.claim("officer_id", profileId);
        }
        return builder.compact();
    }

    @Override
    // Returns the configured access-token lifetime in seconds.
    public long getAccessTokenExpirySeconds() {
        return expirySeconds;
    }
}
