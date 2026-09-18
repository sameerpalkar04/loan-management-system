package com.loan.loanofficerservice.service.implementation;

import com.loan.loanofficerservice.dao.entity.LoanOfficer;
import com.loan.loanofficerservice.dao.repository.LoanOfficerRepository;
import com.loan.loanofficerservice.dto.LoginRequest;
import com.loan.loanofficerservice.dto.LoginResponse;
import com.loan.loanofficerservice.exception.InvalidCredentialsException;
import com.loan.loanofficerservice.service.abstraction.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final LoanOfficerRepository loanOfficerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        LoanOfficer loanOfficer = loanOfficerRepository
                .findByOfficerEmail(loginRequest.getOfficerEmail())
                .orElseThrow(() -> new InvalidCredentialsException(
                        "Invalid email or password"
                ));

        if (!passwordEncoder.matches(
                loginRequest.getOfficerPassword(),
                loanOfficer.getOfficerPassword()
        )) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return new LoginResponse(
                loanOfficer.getLoanOfficerId(),
                loanOfficer.getOfficerName()
        );
    }
}
