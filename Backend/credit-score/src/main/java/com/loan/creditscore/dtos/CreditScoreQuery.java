package com.loan.creditscore.dtos;

import java.time.LocalDateTime;

public class CreditScoreQuery {

    private String panNumber;
    private Integer score;
    private LocalDateTime checkedAt;

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
}