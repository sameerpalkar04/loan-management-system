package com.loan.dao.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "loan_history")
public class LoanHistory {

    @Id
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "approved_by_officer_id", nullable = false)
    private Long approvedByOfficerId;

    @Column(name = "loan_type_id", nullable = false)
    private Long loanTypeId;

    @Column(
            name = "approved_principal",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal approvedPrincipal;

    @Column(
            name = "annual_interest_rate",
            nullable = false,
            precision = 5,
            scale = 2
    )
    private BigDecimal annualInterestRate;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanAccountStatus status;

    @Column(name = "approved_at", nullable = false)
    private LocalDateTime approvedAt;

    @PrePersist
    void beforeInsert() {

        if (status == null) {
            status = LoanAccountStatus.ACTIVE;
        }

        if (approvedAt == null) {
            approvedAt = LocalDateTime.now();
        }
    }


    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getApprovedByOfficerId() {
        return approvedByOfficerId;
    }

    public void setApprovedByOfficerId(Long approvedByOfficerId) {
        this.approvedByOfficerId = approvedByOfficerId;
    }

    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(Long loanTypeId) {
        this.loanTypeId = loanTypeId;
    }

    public BigDecimal getApprovedPrincipal() {
        return approvedPrincipal;
    }

    public void setApprovedPrincipal(BigDecimal approvedPrincipal) {
        this.approvedPrincipal = approvedPrincipal;
    }

    public BigDecimal getAnnualInterestRate() {
        return annualInterestRate;
    }

    public void setAnnualInterestRate(BigDecimal annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public LoanAccountStatus getStatus() {
        return status;
    }

    public void setStatus(LoanAccountStatus status) {
        this.status = status;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}