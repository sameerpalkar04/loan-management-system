package com.loan.loanofficerservice.controller;

import com.loan.loanofficerservice.dto.*;
import com.loan.loanofficerservice.service.abstraction.LoanOfficerActionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;

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
            @PathVariable Long applicationId,
            @Valid @RequestBody ApproveLoanRequest approveLoanRequest,
            @AuthenticationPrincipal LoanOfficerPrincipal loanOfficer
    ) {
        loanOfficerActionService.approveApplication(
                applicationId,
                approveLoanRequest,
                loanOfficer.getOfficerId()
        );

        return ResponseEntity.accepted().build();
    }

    @PutMapping("/applications/{applicationId}/reject")
    public ResponseEntity<Void> rejectApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody RejectLoanRequest rejectLoanRequest,
            @AuthenticationPrincipal LoanOfficerPrincipal loanOfficer
    ) {
        loanOfficerActionService.rejectApplication(
                applicationId,
                rejectLoanRequest,
                loanOfficer.getOfficerId()
        );

        return ResponseEntity.accepted().build();
    }

    @PutMapping("/loan-types/{loanTypeId}")
    public ResponseEntity<Void> updateLoanType(
            @PathVariable Long loanTypeId,
            @Valid @RequestBody LoanTypeUpdateRequest loanTypeUpdateRequest,
            @AuthenticationPrincipal LoanOfficerPrincipal loanOfficer
    ) {
        loanOfficerActionService.updateLoanType(
                loanTypeId,
                loanTypeUpdateRequest,
                loanOfficer.getOfficerId()
        );

        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("/customers/{customerId}")
    public ResponseEntity<DeleteCustomerResponse> deleteCustomer(
            @PathVariable Long customerId,
            @AuthenticationPrincipal LoanOfficerPrincipal loanOfficer
    ) {
        loanOfficerActionService.deleteCustomer(
                customerId,
                loanOfficer.getOfficerId()
        );

        return ResponseEntity.ok(
                new DeleteCustomerResponse(
                        "Customer deleted successfully",
                        customerId
                )
        );
    }
}
