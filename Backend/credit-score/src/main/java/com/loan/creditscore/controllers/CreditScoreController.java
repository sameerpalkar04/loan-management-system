package com.loan.creditscore.controllers;

import com.loan.creditscore.dtos.CheckCreditScoreCommand;
import com.loan.creditscore.dtos.CreditScoreQuery;
import com.loan.creditscore.dtos.SeedCreditScoreCommand;
import com.loan.creditscore.services.implementations.CreditScoreServiceManager;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/credit-scores")
public class CreditScoreController {

    private final CreditScoreServiceManager creditScoreServiceManager;

    public CreditScoreController(
            CreditScoreServiceManager creditScoreServiceManager) {

        this.creditScoreServiceManager = creditScoreServiceManager;
    }

    /*
     * Called after Customer Service successfully registers a customer.
     */
    @PostMapping("/seed")
    public ResponseEntity<CreditScoreQuery> seedCreditScore(
            @Valid @RequestBody SeedCreditScoreCommand command) {

        CreditScoreQuery creditScoreQuery =
                creditScoreServiceManager.add(command);

        return new ResponseEntity<>(
                creditScoreQuery,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/check")
    public ResponseEntity<CreditScoreQuery> checkCreditScore(
            @Valid @RequestBody CheckCreditScoreCommand command) {

        CreditScoreQuery creditScoreQuery =
                creditScoreServiceManager.checkCreditScore(command);

        return new ResponseEntity<>(
                creditScoreQuery,
                HttpStatus.OK
        );
    }
}