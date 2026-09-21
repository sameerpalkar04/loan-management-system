package com.loan.creditscore.controllers;

import com.loan.creditscore.dtos.CreditScoreQuery;
import com.loan.creditscore.services.implementations.CreditScoreServiceManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/{panNumber}")
    public ResponseEntity<CreditScoreQuery> getCreditScore(
            @PathVariable String panNumber) {

        return ResponseEntity.ok(
                creditScoreServiceManager.get(panNumber)
        );
    }
}
