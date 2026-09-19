package com.loan.authservice.dto;

import com.loan.authservice.entity.UserRole;

public record AuthResponse(String accessToken, String tokenType, long expiresInSeconds,
                           UserRole role, Long customerId, Long officerId) { }
