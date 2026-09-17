package com.loan.loanofficerservice.service.abstraction;

import com.loan.loanofficerservice.dto.LoginRequest;
import com.loan.loanofficerservice.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
}
