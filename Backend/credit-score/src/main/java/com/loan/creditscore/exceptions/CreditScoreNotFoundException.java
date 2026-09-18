package com.loan.creditscore.exceptions;

public class CreditScoreNotFoundException extends RuntimeException {

    public CreditScoreNotFoundException(String message) {
        super(message);
    }
}