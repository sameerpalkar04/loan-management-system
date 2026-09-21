package com.loan.creditscore.daos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "CREDIT_SCORE_HISTORY")
public class CreditScoreHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CREDIT_SCORE_HISTORY_ID")
    private Long creditScoreHistoryId;

    @Column(name = "PAN_NUMBER", nullable = false, length = 10)
    private String panNumber;

    @Column(name = "SCORE", nullable = false)
    private Integer score;

    @Column(name = "LOAN_OFFICER_ID", nullable = false)
    private Long loanOfficerId;

    @Column(name = "OFFICER_NAME", nullable = false, length = 200)
    private String officerName;

    @Column(name = "APPLICATION_ID", nullable = false)
    private Long applicationId;

    @Column(name = "CHECKED_AT", nullable = false, updatable = false)
    private LocalDateTime checkedAt;

    public CreditScoreHistory() {
    }

    @PrePersist
    public void setCheckedAtBeforeInsert() {
        if (checkedAt == null) {
            checkedAt = LocalDateTime.now();
        }
    }

    public Long getCreditScoreHistoryId() {
        return creditScoreHistoryId;
    }

    public void setCreditScoreHistoryId(Long creditScoreHistoryId) {
        this.creditScoreHistoryId = creditScoreHistoryId;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Long getLoanOfficerId() {
        return loanOfficerId;
    }

    public void setLoanOfficerId(Long loanOfficerId) {
        this.loanOfficerId = loanOfficerId;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }
}
