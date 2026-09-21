package com.loan.loanofficerservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
    @NotNull(message = "Valuation is required")
    @Positive(message = "Valuation must be greater than zero")
    private BigDecimal valuation;
}
