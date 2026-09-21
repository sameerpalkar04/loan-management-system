package com.loanmanagement.loantype.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "LOAN_TYPE")
public class LoanType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOAN_TYPE_ID", nullable = false)
    private Long loanTypeId;

    @Column(name = "LOAN_NAME", nullable = false, length = 100)
    private String loanName;

    @Column(name = "BASE_INTEREST_RATE", nullable = false, precision = 5, scale = 2)
    private BigDecimal baseInterestRate;

    @Column(name = "MAXIMUM_TENURE_MONTHS", nullable = false)
    private Integer maximumTenureMonths;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Column(name = "MAXIMUM_LOAN_AMOUNT", precision = 15, scale = 2)
    private BigDecimal maximumLoanAmount;

    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(Long loanTypeId) {
        this.loanTypeId = loanTypeId;
    }

    public String getLoanName() {
        return loanName;
    }

    public void setLoanName(String loanName) {
        this.loanName = loanName;
    }

    public BigDecimal getBaseInterestRate() {
        return baseInterestRate;
    }

    public void setBaseInterestRate(BigDecimal baseInterestRate) {
        this.baseInterestRate = baseInterestRate;
    }

    public Integer getMaximumTenureMonths() {
        return maximumTenureMonths;
    }

    public void setMaximumTenureMonths(Integer maximumTenureMonths) {
        this.maximumTenureMonths = maximumTenureMonths;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getMaximumLoanAmount() {
        return maximumLoanAmount;
    }

    public void setMaximumLoanAmount(BigDecimal maximumLoanAmount) {
        this.maximumLoanAmount = maximumLoanAmount;
    }
}