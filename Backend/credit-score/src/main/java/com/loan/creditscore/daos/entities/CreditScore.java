package com.loan.creditscore.daos.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "CREDIT_SCORE")
public class CreditScore {

    @Id
    @Column(name = "PAN_NUMBER", nullable = false, length = 10)
    private String panNumber;

    @Column(name = "SCORE", nullable = false)
    private Integer score;

    @Column(name = "CHECKED_AT", nullable = false)
    private LocalDateTime checkedAt;

    public CreditScore() {
    }

    public CreditScore(String panNumber, Integer score) {
        this.panNumber = panNumber;
        this.score = score;
    }

    @PrePersist
    public void setCheckedAtBeforeInsert() {
        if (checkedAt == null) {
            checkedAt = LocalDateTime.now();
        }
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