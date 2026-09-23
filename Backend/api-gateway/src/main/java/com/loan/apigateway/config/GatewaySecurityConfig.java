package com.loan.apigateway.config;

import com.loan.apigateway.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class GatewaySecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public GatewaySecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/customers/register")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/customers/login")
                        .permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/customers/me")
                        .hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.GET, "/api/customers/**")
                        .hasRole("LOAN_OFFICER")

                        .requestMatchers(HttpMethod.GET, "/api/loan-types/**")
                        .hasAnyRole("CUSTOMER", "LOAN_OFFICER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/loan-types/**"
                        ).hasRole("LOAN_OFFICER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/loan-types/**"
                        ).hasRole("LOAN_OFFICER")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/loan-types/**"
                        ).hasRole("LOAN_OFFICER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/loan-applications/**"
                        ).hasRole("CUSTOMER")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/loan-applications/me"
                        ).hasRole("CUSTOMER")

                        .requestMatchers("/api/v1/loan-applications/**")
                        .hasRole("LOAN_OFFICER")

                        .requestMatchers("/api/loan-officer/**")
                        .hasRole("LOAN_OFFICER")

                        .requestMatchers("/api/credit-scores/**")
                        .hasRole("LOAN_OFFICER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }
}
