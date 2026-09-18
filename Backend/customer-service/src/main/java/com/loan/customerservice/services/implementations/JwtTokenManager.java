//package com.loan.customerservice.services.implementations;
//
//import com.loan.customerservice.daos.entities.Customer;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.JwtBuilder;
//import io.jsonwebtoken.JwtParser;
//import io.jsonwebtoken.JwtParserBuilder;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.SecretKey;
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class JwtTokenManager {
//
//    private final String privateKey =
//            "mysecretkeymysecretkeymysecretkeymysecretkeymysecretkey";
//
//    private final SecretKey secretKey =
//            Keys.hmacShaKeyFor(privateKey.getBytes(StandardCharsets.UTF_8));
//
//    public String createToken(Customer customer) {
//
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("customerId", customer.getCustomerId());
//        claims.put("role", "ROLE_CUSTOMER");
//
//        JwtBuilder jwtBuilder = Jwts.builder();
//
//        return jwtBuilder
//                .claims()
//                .add(claims)
//                .subject(customer.getEmail())
//                .issuedAt(new Date(System.currentTimeMillis()))
//                .expiration(new Date(
//                        System.currentTimeMillis() + (60L * 60 * 1000)
//                ))
//                .and()
//                .signWith(secretKey)
//                .compact();
//    }
//
//    public boolean verifyToken(String token, String email) {
//
//        Claims claims = extractClaims(token);
//
//        return !claims.getExpiration().before(new Date())
//                && claims.getSubject().equals(email);
//    }
//
//    public Claims extractClaims(String token) {
//
//        JwtParserBuilder parserBuilder = Jwts.parser();
//
//        JwtParser jwtParser = parserBuilder
//                .verifyWith(secretKey)
//                .build();
//
//        return jwtParser
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//}