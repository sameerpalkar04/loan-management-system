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
        String decisionReason,

        ApplicationStatus status,
        LocalDateTime appliedAt,
        LocalDateTime reviewedAt
) {
}
