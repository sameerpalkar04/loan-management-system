package com.loan.dao.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "loan_application")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "loan_type_id", nullable = false)
    private Long loanTypeId;

    @Column(name = "requested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;

    @Column(name = "requested_tenure_months", nullable = false)
    private Integer requestedTenureMonths;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "reviewed_by_officer_id")
    private Long reviewedByOfficerId;

    @Column(name = "decision_reason", length = 500)
    private String decisionReason;

    @Column(name = "valuation", nullable = false, precision = 15, scale = 2)
    private BigDecimal valuation;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    public void beforeInsert() {

        LocalDateTime now = LocalDateTime.now();

        appliedAt = now;
        updatedAt = now;

        if (status == null) {
            status = ApplicationStatus.PENDING;
        }
    }

    @PreUpdate
    public void beforeUpdate() {

        updatedAt = LocalDateTime.now();
    }


    public Long getApplicationId() {
        return applicationId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(Long loanTypeId) {
        this.loanTypeId = loanTypeId;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public Integer getRequestedTenureMonths() {
        return requestedTenureMonths;
    }

    public void setRequestedTenureMonths(Integer requestedTenureMonths) {
        this.requestedTenureMonths = requestedTenureMonths;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Long getReviewedByOfficerId() {
        return reviewedByOfficerId;
    }

    public void setReviewedByOfficerId(Long reviewedByOfficerId) {
        this.reviewedByOfficerId = reviewedByOfficerId;
    }

    public String getDecisionReason() {
        return decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
    }

    public BigDecimal getValuation() {
        return valuation;
    }

    public void setValuation(BigDecimal valuation) {
        this.valuation = valuation;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public byte[] getPanCardImage() {
        return panCardImage;
    }

    public void setPanCardImage(byte[] panCardImage) {
        this.panCardImage = panCardImage;
    }

    public String getPanCardImageContentType() {
        return panCardImageContentType;
    }

    public void setPanCardImageContentType(String panCardImageContentType) {
        this.panCardImageContentType = panCardImageContentType;
    }

    public String getPanCardImageFileName() {
        return panCardImageFileName;
    }

    public void setPanCardImageFileName(String panCardImageFileName) {
        this.panCardImageFileName = panCardImageFileName;
    }

    public Long getPanCardImageSizeBytes() {
        return panCardImageSizeBytes;
    }

    public void setPanCardImageSizeBytes(Long panCardImageSizeBytes) {
        this.panCardImageSizeBytes = panCardImageSizeBytes;
    }
}