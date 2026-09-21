package com.loan.dto.request;

import com.loan.dao.entity.ApplicationStatus;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UpdateApplicationStatus(

        @NotNull(message = "Application status is required")
        ApplicationStatus status,

        @Size(
                max = 500,
                message = "Decision reason cannot exceed 500 characters"
        )
        String decisionReason,

        @Positive(message = "Approved principal must be greater than zero")
        BigDecimal approvedPrincipal,

        @DecimalMin(
                value = "0.0",
                inclusive = true,
                message = "Interest rate cannot be negative"
        )
        BigDecimal annualInterestRate,

        @Positive(message = "Tenure must be greater than zero")
        Integer tenureMonths,

        @Positive(message = "Valuation must be greater than zero")
        BigDecimal valuation
) {
}
