package com.loan.authservice.controller;

import com.loan.authservice.dto.AuthResponse;
import com.loan.authservice.dto.LoginRequest;
import com.loan.authservice.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
// Exposes role-specific authentication endpoints.
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {

        this.authenticationService = authenticationService;
    }

    @PostMapping("/customers/login")
    // Authenticates a customer and issues an access token.
    public ResponseEntity<AuthResponse> loginCustomer(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.loginCustomer(request));
    }

    @PostMapping("/officers/login")
    // Authenticates a loan officer and issues an access token.
    public ResponseEntity<AuthResponse> loginOfficer(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.loginOfficer(request));
    }
}
