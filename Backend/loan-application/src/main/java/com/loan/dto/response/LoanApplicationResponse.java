package com.loan.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.loan.dao.entity.ApplicationStatus;

public record LoanApplicationResponse(

        Long applicationId,
        Long customerId,
        Long loanTypeId,
        Long reviewedByOfficerId,

        BigDecimal requestedAmount,
        Integer requestedTenureMonths,
        BigDecimal interestRate,
        BigDecimal valuation,

        ApplicationStatus status,
        LocalDateTime appliedAt,
        LocalDateTime reviewedAt
) {
}
