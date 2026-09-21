package com.loan.apigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecretKey signingKey;

    public JwtAuthenticationFilter(
            @Value("${gateway.jwt.secret}") String base64Secret) {

        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(base64Secret)
        );
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("/api/v1/auth/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authorization.substring(7);

            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String role = claims.get("role", String.class);
//
//            System.out.println("===== JWT DEBUG =====");
//            System.out.println("URI: " + request.getRequestURI());
//            System.out.println("Role: " + role);
//            System.out.println("Customer ID: " + claims.get("customer_id"));
//            System.out.println("=====================");

            if (role == null || role.isBlank()) {
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "JWT role claim is missing"
                );
                return;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            claims.getSubject(),
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Map<String, String> identityHeaders = new LinkedHashMap<>();
            identityHeaders.put("X-User-Role", role);

            Object customerId = claims.get("customer_id");
            if (customerId != null) {
                identityHeaders.put("X-Customer-Id", customerId.toString());
            }

            Object officerId = claims.get("officer_id");
            if (officerId != null) {
                identityHeaders.put("X-Officer-Id", officerId.toString());
            }

            filterChain.doFilter(
                    new IdentityHeaderRequestWrapper(request, identityHeaders),
                    response
            );

        } catch (Exception exception) {
            SecurityContextHolder.clearContext();

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired JWT"
            );
        }
    }

    private static class IdentityHeaderRequestWrapper
            extends HttpServletRequestWrapper {

        private final Map<String, String> addedHeaders;

        IdentityHeaderRequestWrapper(
                HttpServletRequest request,
                Map<String, String> addedHeaders) {

            super(request);
            this.addedHeaders = addedHeaders;
        }

        @Override
        public String getHeader(String name) {
            for (Map.Entry<String, String> entry : addedHeaders.entrySet()) {
                if (entry.getKey().equalsIgnoreCase(name)) {
                    return entry.getValue();
                }
            }

            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            String header = getHeader(name);

            if (header == null) {
                return Collections.emptyEnumeration();
            }

            return Collections.enumeration(List.of(header));
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            List<String> names = new ArrayList<>(
                    Collections.list(super.getHeaderNames())
            );

            for (String addedHeader : addedHeaders.keySet()) {
                boolean alreadyPresent = names.stream()
                        .anyMatch(name -> name.equalsIgnoreCase(addedHeader));

                if (!alreadyPresent) {
                    names.add(addedHeader);
                }
            }

            return Collections.enumeration(names);
        }
    }
}