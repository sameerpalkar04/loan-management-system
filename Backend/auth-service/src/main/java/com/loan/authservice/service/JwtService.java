package com.loan.authservice.service;

public interface JwtService {
    String generateCustomerAccessToken(Long customerId);
    String generateOfficerAccessToken(Long officerId);
    long getAccessTokenExpirySeconds();
}
