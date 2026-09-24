package com.loan.loanofficerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplicationResponse {
    private Long applicationId;
    private Long customerId;
    private Long loanTypeId;
    private Long reviewedByOfficerId;

    private BigDecimal requestedAmount;
    private Integer requestedTenureMonths;

    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private BigDecimal valuation;
    private String decisionReason;
    private String applicantName;
    private String panNumber;
}
