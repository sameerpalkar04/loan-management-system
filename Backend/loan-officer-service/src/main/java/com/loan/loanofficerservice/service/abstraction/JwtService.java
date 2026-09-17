package com.loan.loanofficerservice.service.abstraction;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateToken(String officerEmail);

    String extractOfficerEmail(String token);

    boolean validateToken(String token, UserDetails userDetails);
}
