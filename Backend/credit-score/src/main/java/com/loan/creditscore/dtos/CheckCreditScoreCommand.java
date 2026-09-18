package com.loan.creditscore.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CheckCreditScoreCommand {

    @NotBlank(message = "PAN number is required")
    @Pattern(
            regexp = "^[A-Za-z0-9]{10}$",
            message = "PAN number must contain exactly 10 alphanumeric characters"
    )
    private String panNumber;

    @NotNull(message = "Loan officer ID is required")
    @Positive(message = "Loan officer ID must be positive")
    private Long loanOfficerId;

    @NotBlank(message = "Officer name is required")
    @Size(max = 200, message = "Officer name cannot exceed 200 characters")
    private String officerName;

    @NotNull(message = "Application ID is required")
    @Positive(message = "Application ID must be positive")
    private Long applicationId;

    public CheckCreditScoreCommand() {
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
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
}