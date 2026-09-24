package com.loan.creditscore.controllers;

import com.loan.creditscore.dtos.CreditScoreQuery;
import com.loan.creditscore.dtos.CheckCreditScoreCommand;
import com.loan.creditscore.services.implementations.CreditScoreServiceManager;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/credit-scores")
public class CreditScoreController {

    private final CreditScoreServiceManager creditScoreServiceManager;

    public CreditScoreController(
            CreditScoreServiceManager creditScoreServiceManager) {

        this.creditScoreServiceManager = creditScoreServiceManager;
    }

    @PostMapping("/check")
    public ResponseEntity<CreditScoreQuery> checkCreditScore(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Officer-Id") Long officerId,
            @Valid @RequestBody CheckCreditScoreCommand command) {

        if (!"LOAN_OFFICER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        command.setLoanOfficerId(officerId);
        return ResponseEntity.ok(
                creditScoreServiceManager.checkCreditScore(command)
        );
    }

    @PostMapping("/viewed-applications")
    public ResponseEntity<List<Long>> getViewedApplications(
            @RequestHeader("X-User-Role") String role,
            @RequestBody List<Long> applicationIds) {

        if (!"LOAN_OFFICER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                creditScoreServiceManager
                        .getViewedApplicationIds(applicationIds)
        );
    }
}
