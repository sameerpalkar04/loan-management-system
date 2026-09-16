package com.loan.customerservice.controllers;

import com.loan.customerservice.dtos.CustomerLoginCommand;
import com.loan.customerservice.dtos.CustomerQuery;
import com.loan.customerservice.dtos.CustomerRegistrationCommand;
import com.loan.customerservice.dtos.LoginQuery;
import com.loan.customerservice.services.implementations.CustomerServiceManager;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerServiceManager customerServiceManager;

    public CustomerController(CustomerServiceManager customerServiceManager) {
        this.customerServiceManager = customerServiceManager;
    }

    @PostMapping("/register")
    public ResponseEntity<CustomerQuery> registerCustomer(
            @Valid @RequestBody CustomerRegistrationCommand command) {

        CustomerQuery customerQuery = customerServiceManager.add(command);

        return new ResponseEntity<>(customerQuery, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginQuery> loginCustomer(
            @Valid @RequestBody CustomerLoginCommand command) {

        LoginQuery loginQuery = customerServiceManager.login(command);

        return new ResponseEntity<>(loginQuery, HttpStatus.OK);
    }

    @GetMapping("/token-test")
    public ResponseEntity<String> testToken(Authentication authentication) {

        String loggedInEmail = authentication.getName();

        return ResponseEntity.ok(
                "Authenticated customer: " + loggedInEmail
        );
    }
}