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
public class LoanOfficerController {
    private final LoanOfficerActionService loanOfficerActionService;

    @GetMapping("/applications")
    public ResponseEntity<List<LoanApplicationResponse>> viewAllApplications() {
        return ResponseEntity.ok(
                loanOfficerActionService.viewAllApplications()
        );
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<LoanApplicationResponse> viewApplicationById(
            @PathVariable Long applicationId
    ) {
        return ResponseEntity.ok(
                loanOfficerActionService.viewApplicationById(applicationId)
        );
    }

    @PutMapping("/applications/{applicationId}/approve")
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
    public ResponseEntity<byte[]> viewPanCardImage(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long applicationId
    ) {
        requireLoanOfficer(role);

        return loanOfficerActionService.viewPanCardImage(applicationId);
    }

    private void requireLoanOfficer(String role) {
        if (!"LOAN_OFFICER".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only loan officers can view PAN-card images"
            );
        }
    }
}
