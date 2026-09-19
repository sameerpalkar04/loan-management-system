package com.loan.authservice.service;

import com.loan.authservice.dto.AuthResponse;
import com.loan.authservice.dto.LoginRequest;
import com.loan.authservice.entity.CustomerCredential;
import com.loan.authservice.entity.LoanOfficerCredential;
import com.loan.authservice.entity.UserRole;
import com.loan.authservice.exception.InvalidCredentialsException;
import com.loan.authservice.repository.CustomerCredentialRepository;
import com.loan.authservice.repository.LoanOfficerCredentialRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class AuthenticationService {

    private final CustomerCredentialRepository customerCredentialRepository;
    private final LoanOfficerCredentialRepository loanOfficerCredentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationService(CustomerCredentialRepository customerCredentialRepository,
                                 LoanOfficerCredentialRepository loanOfficerCredentialRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService) {
        this.customerCredentialRepository = customerCredentialRepository;
        this.loanOfficerCredentialRepository = loanOfficerCredentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse loginCustomer(LoginRequest request) {
        CustomerCredential customer = customerCredentialRepository
                .findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), customer.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return new AuthResponse(
                jwtService.generateCustomerAccessToken(customer.getCustomerId()),
                "Bearer",
                jwtService.getAccessTokenExpirySeconds(),
                UserRole.CUSTOMER,
                customer.getCustomerId(),
                null
        );
    }

    public AuthResponse loginOfficer(LoginRequest request) {
        LoanOfficerCredential officer = loanOfficerCredentialRepository
                .findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(InvalidCredentialsException::new);


        if (!passwordEncoder.matches(request.password(), officer.getPasswordHash())) {
            System.out.println("Password does not match");
            throw new InvalidCredentialsException();
        }

        return new AuthResponse(
                jwtService.generateOfficerAccessToken(officer.getOfficerId()),
                "Bearer",
                jwtService.getAccessTokenExpirySeconds(),
                UserRole.LOAN_OFFICER,
                null,
                officer.getOfficerId()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
