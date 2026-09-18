package com.loan.creditscore.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SeedCreditScoreCommand {

    @NotBlank(message = "PAN number is required")
    @Pattern(
            regexp = "^[A-Za-z0-9]{10}$",
            message = "PAN number must contain exactly 10 alphanumeric characters"
    )
    private String panNumber;

    public SeedCreditScoreCommand() {
    }

    public SeedCreditScoreCommand(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }
}