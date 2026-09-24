package com.loanmanagement.loantype.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;

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
    @Digits(integer = 13, fraction = 2, message = "Maximum loan amount must have at most 13 integer digits and 2 decimal places")
    private BigDecimal maximumLoanAmount;

    @NotNull(message = "Collateral requirement is required")
    private Boolean collateralRequired;

    @DecimalMin(value = "0.01", message = "Maximum LTV percentage must be greater than zero")
    @DecimalMax(value = "100.00", message = "Maximum LTV percentage cannot exceed 100")
    @Digits(integer = 3, fraction = 2, message = "Maximum LTV percentage must have at most 2 decimal places")
    private BigDecimal maximumLtvPercentage;

    @AssertTrue(message = "Maximum LTV percentage is required when collateral is required")
    public boolean isCollateralConfigurationValid() {
        return !Boolean.TRUE.equals(collateralRequired)
                || maximumLtvPercentage != null;
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

    public Boolean getCollateralRequired() {
        return collateralRequired;
    }

    public void setCollateralRequired(Boolean collateralRequired) {
        this.collateralRequired = collateralRequired;
    }

    public BigDecimal getMaximumLtvPercentage() {
        return maximumLtvPercentage;
    }

    public void setMaximumLtvPercentage(BigDecimal maximumLtvPercentage) {
        this.maximumLtvPercentage = maximumLtvPercentage;
    }
}
