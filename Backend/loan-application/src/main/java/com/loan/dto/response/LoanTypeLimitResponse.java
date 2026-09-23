package com.loan.dto.response;

import java.math.BigDecimal;

/**
 * The loan-type limits required before accepting a loan application.
 */
public record LoanTypeLimitResponse(
        Long loanTypeId,
        String loanName,
        BigDecimal maximumLoanAmount,
        Integer maximumTenureMonths) {
}
