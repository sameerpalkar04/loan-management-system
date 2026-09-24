package com.loanmanagement.loantype.dto;

import com.loanmanagement.loantype.entity.LoanType;

import java.math.BigDecimal;

public class LoanTypeResponse {

    private final Long loanTypeId;
    private final String loanName;
    private final BigDecimal baseInterestRate;
    private final Integer maximumTenureMonths;
    private final String description;
    private final BigDecimal maximumLoanAmount;
    private final Boolean collateralRequired;
    private final BigDecimal maximumLtvPercentage;

    public LoanTypeResponse(
            Long loanTypeId,
            String loanName,
            BigDecimal baseInterestRate,
            Integer maximumTenureMonths,
            String description,
            BigDecimal maximumLoanAmount,
            Boolean collateralRequired,
            BigDecimal maximumLtvPercentage) {

        this.loanTypeId = loanTypeId;
        this.loanName = loanName;
        this.baseInterestRate = baseInterestRate;
        this.maximumTenureMonths = maximumTenureMonths;
        this.description = description;
        this.maximumLoanAmount = maximumLoanAmount;
        this.collateralRequired = collateralRequired;
        this.maximumLtvPercentage = maximumLtvPercentage;
    }

    public static LoanTypeResponse fromEntity(LoanType loanType) {
        return new LoanTypeResponse(
                loanType.getLoanTypeId(),
                loanType.getLoanName(),
                loanType.getBaseInterestRate(),
                loanType.getMaximumTenureMonths(),
                loanType.getDescription(),
                loanType.getMaximumLoanAmount(),
                loanType.getCollateralRequired(),
                loanType.getMaximumLtvPercentage()
        );
    }

    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public String getLoanName() {
        return loanName;
    }

    public BigDecimal getBaseInterestRate() {
        return baseInterestRate;
    }

    public Integer getMaximumTenureMonths() {
        return maximumTenureMonths;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getMaximumLoanAmount() {
        return maximumLoanAmount;
    }

    public Boolean getCollateralRequired() {
        return collateralRequired;
    }

    public BigDecimal getMaximumLtvPercentage() {
        return maximumLtvPercentage;
    }
}
