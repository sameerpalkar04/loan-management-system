package com.loan.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CalculateInterestRateRequest(

        @NotNull(message = "Loan type id is required")
        Long loanTypeId,

        @NotNull(message = "Requested tenure is required")
        @Positive(message = "Requested tenure must be greater than zero")
        Integer requestedTenureMonths
) {
}
