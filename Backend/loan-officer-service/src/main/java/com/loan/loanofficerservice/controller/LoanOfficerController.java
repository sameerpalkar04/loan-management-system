package com.loan.loanofficerservice.controller;

import com.loan.loanofficerservice.dto.*;
import com.loan.loanofficerservice.service.abstraction.LoanOfficerActionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/loan-officer")
@RequiredArgsConstructor
// Orchestrates officer-facing application review actions.
public class LoanOfficerController {
    private final LoanOfficerActionService loanOfficerActionService;

    @GetMapping("/applications")
    // Lists applications enriched with customer review data.
    public ResponseEntity<List<LoanApplicationResponse>> viewAllApplications() {
        return ResponseEntity.ok(
                loanOfficerActionService.viewAllApplications()
        );
    }

    @GetMapping("/applications/{applicationId}")
    // Retrieves one enriched application for review.
    public ResponseEntity<LoanApplicationResponse> viewApplicationById(
            @PathVariable Long applicationId
    ) {
        return ResponseEntity.ok(
                loanOfficerActionService.viewApplicationById(applicationId)
        );
    }

    @PutMapping("/applications/{applicationId}/approve")
    // Sends an approval decision and approved terms to the application service.
    public ResponseEntity<Void> approveApplication(
            @RequestHeader("X-Officer-Id") Long officerId,
            @PathVariable Long applicationId,
            @Valid @RequestBody ApproveLoanRequest approveLoanRequest
    ) {
        loanOfficerActionService.approveApplication(
                officerId,
                applicationId,
                approveLoanRequest
        );

        return ResponseEntity.accepted().build();
    }

    @PutMapping("/applications/{applicationId}/reject")
    // Sends a rejection decision and reason to the application service.
    public ResponseEntity<Void> rejectApplication(
            @RequestHeader("X-Officer-Id") Long officerId,
            @PathVariable Long applicationId,
            @Valid @RequestBody RejectLoanRequest rejectLoanRequest
    ) {
        loanOfficerActionService.rejectApplication(
                officerId,
                applicationId,
                rejectLoanRequest
        );

        return ResponseEntity.accepted().build();
    }

    @GetMapping("/applications/{applicationId}/pan-card-image")
    // Proxies a submitted PAN-card image for an authorized officer review.
    public ResponseEntity<byte[]> viewPanCardImage(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long applicationId
    ) {
        requireLoanOfficer(role);

        return loanOfficerActionService.viewPanCardImage(applicationId);
    }

    // Guards PAN document retrieval against non-officer callers.
    private void requireLoanOfficer(String role) {
        if (!"LOAN_OFFICER".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only loan officers can view PAN-card images"
            );
        }
    }
}
