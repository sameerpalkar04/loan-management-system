package com.loan.loanofficerservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    @NotBlank(message = "Officer email is required")
    @Email(message = "Enter a valid officer email address")
    private String officerEmail;

    @NotBlank(message = "Password is required")
    private String officerPassword;
}
