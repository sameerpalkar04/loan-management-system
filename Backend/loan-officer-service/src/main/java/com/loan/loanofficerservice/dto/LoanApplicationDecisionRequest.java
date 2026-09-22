package com.loan.loanofficerservice.dto;

import java.math.BigDecimal;

public record LoanApplicationDecisionRequest(
        String status,
        String decisionReason,
        BigDecimal approvedPrincipal,
        BigDecimal annualInterestRate,
        Integer tenureMonths,
        BigDecimal valuation
) {
}
