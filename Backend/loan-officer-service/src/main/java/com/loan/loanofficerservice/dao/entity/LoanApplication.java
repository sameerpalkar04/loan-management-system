package com.loan.loanofficerservice.dao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "LOAN_APPLICATION", schema = "SYSTEM")
public class LoanApplication {

    @Id
    @Column(name = "APPLICATION_ID")
    private Long applicationId;

    @Column(name = "CUSTOMER_ID", nullable = false)
    private Long customerId;

    @Column(name = "LOAN_TYPE_ID", nullable = false)
    private Long loanTypeId;

    @Column(name = "REVIEWED_BY_OFFICER_ID")
    private Long reviewedByOfficerId;

    @Column(name = "REQUESTED_AMOUNT", nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;

    @Column(name = "REQUESTED_TENURE_MONTHS", nullable = false)
    private Integer requestedTenureMonths;

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status;

    @Column(name = "APPLIED_AT", nullable = false)
    private LocalDateTime appliedAt;

    @Column(name = "REVIEWED_AT")
    private LocalDateTime reviewedAt;

    @Column(name = "VALUATION", nullable = false, precision = 15, scale = 2)
    private BigDecimal valuation;
}
