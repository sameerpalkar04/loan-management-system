package com.loan.loanofficerservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class ApproveLoanRequest {

    @NotNull(message = "Approved principal is required")
    @Positive(message = "Approved principal must be greater than zero")
    private BigDecimal approvedPrincipal;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Interest rate cannot be negative"
    )
    private BigDecimal annualInterestRate;

    @NotNull(message = "Tenure is required")
    @Positive(message = "Tenure must be greater than zero")
    private Integer tenureMonths;

    @Positive(message = "Valuation must be greater than zero")
    private BigDecimal valuation;

}
