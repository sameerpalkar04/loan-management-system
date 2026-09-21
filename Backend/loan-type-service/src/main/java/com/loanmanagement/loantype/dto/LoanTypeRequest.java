package com.loanmanagement.loantype.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class LoanTypeRequest {

    @NotBlank(message = "Loan name is required")
    @Size(max = 100, message = "Loan name cannot exceed 100 characters")
    private String loanName;

    @NotNull(message = "Base interest rate is required")
    @DecimalMin(value = "0.01", message = "Base interest rate must be greater than zero")
    private BigDecimal baseInterestRate;

    @NotNull(message = "Maximum tenure is required")
    @Min(value = 1, message = "Maximum tenure must be at least 1 month")
    private Integer maximumTenureMonths;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @DecimalMin(value = "0.01", message = "Maximum loan amount must be greater than zero")
    private BigDecimal maximumLoanAmount;

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