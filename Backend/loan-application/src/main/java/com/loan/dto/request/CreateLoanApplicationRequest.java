package com.loan.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateLoanApplicationRequest(

        @NotNull(message = "Loan type id is required")
        Long loanTypeId,

        @NotNull(message = "Requested amount is required")
        @DecimalMin(
                value = "1.00",
                message = "Requested amount must be greater than zero"
        )
        @Digits(
                integer = 13,
                fraction = 2,
                message = "Requested amount must have at most 13 integer digits and 2 decimal places"
        )
        BigDecimal requestedAmount,

        @NotNull(message = "Requested tenure is required")
        @Positive(message = "Requested tenure must be greater than zero")
        Integer requestedTenureMonths,

        @DecimalMin(
                value = "1.00",
                message = "Valuation must be greater than zero"
        )
        @Digits(
                integer = 13,
                fraction = 2,
                message = "Valuation must have at most 13 integer digits and 2 decimal places"
        )
        BigDecimal valuation
) {
}
