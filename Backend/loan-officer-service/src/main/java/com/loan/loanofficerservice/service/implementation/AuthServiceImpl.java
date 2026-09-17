package com.loan.loanofficerservice.service.implementation;

import com.loan.loanofficerservice.dto.LoanOfficerPrincipal;
import com.loan.loanofficerservice.dto.LoginRequest;
import com.loan.loanofficerservice.dto.LoginResponse;
import com.loan.loanofficerservice.exception.InvalidCredentialsException;
import com.loan.loanofficerservice.service.abstraction.AuthService;
import com.loan.loanofficerservice.service.abstraction.JwtService;
import com.loan.loanofficerservice.service.abstraction.LoanOfficerDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final LoanOfficerDetailsService loanOfficerDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        LoanOfficerPrincipal loanOfficer;

        try {
            loanOfficer = loanOfficerDetailsService.loadUserByUsername(
                    loginRequest.getOfficerEmail()
            );
        } catch (UsernameNotFoundException exception) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!passwordEncoder.matches(
                loginRequest.getOfficerPassword(),
                loanOfficer.getPassword()
        )) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(loanOfficer.getUsername());

        return new LoginResponse(
                token,
                "Bearer",
                loanOfficer.getOfficerId(),
                loanOfficer.getOfficerName()
        );
    }
}