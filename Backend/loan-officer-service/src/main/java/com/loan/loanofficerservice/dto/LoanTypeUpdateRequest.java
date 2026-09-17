package com.loan.loanofficerservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class LoanTypeUpdateRequest {

    @NotBlank(message = "Loan name is required")
    private String loanName;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Interest rate cannot be negative"
    )
    private BigDecimal baseInterestRate;

    @NotNull(message = "Maximum tenure is required")
    @Positive(message = "Maximum tenure must be greater than zero")
    private Integer maximumTenureMonths;

    @NotNull(message = "Maximum loan amount is required")
    @Positive(message = "Maximum loan amount must be greater than zero")
    private BigDecimal maximumLoanAmount;

    private String description;
}