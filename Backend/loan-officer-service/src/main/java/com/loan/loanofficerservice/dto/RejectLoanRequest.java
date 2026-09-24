package com.loan.loanofficerservice.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RejectLoanRequest {
    @Positive(message = "Valuation must be greater than zero")
    private BigDecimal valuation;

    @NotBlank(message = "A rejection reason is required")
    @Size(max = 500, message = "Rejection reason cannot exceed 500 characters")
    private String decisionReason;
}
