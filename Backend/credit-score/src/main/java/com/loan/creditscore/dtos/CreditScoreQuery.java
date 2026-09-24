package com.loan.creditscore.dtos;

import java.time.LocalDateTime;

public class CreditScoreQuery {

    private String panNumber;
    private String maskedPanNumber;
    private Integer score;
    private LocalDateTime checkedAt;
    private String band;
    private String repaymentSummary;
    private LocalDateTime generatedAt;
    private LocalDateTime retrievedAt;
    private String action;

    public CreditScoreQuery() {
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

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }

    public String getMaskedPanNumber() {
        return maskedPanNumber;
    }

    public void setMaskedPanNumber(String maskedPanNumber) {
        this.maskedPanNumber = maskedPanNumber;
    }

    public String getBand() {
        return band;
    }

    public void setBand(String band) {
        this.band = band;
    }

    public String getRepaymentSummary() {
        return repaymentSummary;
    }

    public void setRepaymentSummary(String repaymentSummary) {
        this.repaymentSummary = repaymentSummary;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public LocalDateTime getRetrievedAt() {
        return retrievedAt;
    }

    public void setRetrievedAt(LocalDateTime retrievedAt) {
        this.retrievedAt = retrievedAt;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
