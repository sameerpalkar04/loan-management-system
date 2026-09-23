package com.loan.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.loan.dto.request.CreateLoanApplicationRequest;
import com.loan.dto.request.UpdateApplicationStatus;
import com.loan.dto.response.LoanApplicationResponse;
import com.loan.service.LoanApplicationServices;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/loan-applications")
public class LoanApplicationController {

    private final LoanApplicationServices loanApplicationService;

    public LoanApplicationController(
            LoanApplicationServices loanApplicationService) {
        this.loanApplicationService = loanApplicationService;
    }

    @PostMapping
    public ResponseEntity<LoanApplicationResponse> createApplication(
            @RequestHeader("X-Customer-Id") Long customerId,
            @RequestHeader("X-User-Role") String role,

            @Valid
            @RequestPart("application")
            CreateLoanApplicationRequest request,

            @RequestPart("panCardImage")
            MultipartFile panCardImage
    ) {
        requireRole(role, "CUSTOMER");

        LoanApplicationResponse response =
                loanApplicationService.createApplication(
                        customerId,
                        request,
                        panCardImage
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<LoanApplicationResponse>> getMyApplications(
            @RequestHeader("X-Customer-Id") Long customerId,
            @RequestHeader("X-User-Role") String role) {
        requireRole(role, "CUSTOMER");

        return ResponseEntity.ok(
                loanApplicationService.getCustomerApplications(customerId)
        );
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponse>> getAllApplications(
            @RequestHeader("X-User-Role") String role) {
        requireRole(role, "LOAN_OFFICER");

        return ResponseEntity.ok(
                loanApplicationService.getAllApplications()
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LoanApplicationResponse>> getPendingApplications(
            @RequestHeader("X-User-Role") String role) {
        requireRole(role, "LOAN_OFFICER");

        return ResponseEntity.ok(
                loanApplicationService.getPendingApplications()
        );
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<LoanApplicationResponse> getApplicationById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long applicationId) {
        requireRole(role, "LOAN_OFFICER");

        return ResponseEntity.ok(
                loanApplicationService.getApplicationById(applicationId)
        );
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<LoanApplicationResponse> updateApplicationStatus(
            @RequestHeader("X-Officer-Id") Long officerId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateApplicationStatus request) {
        requireRole(role, "LOAN_OFFICER");

        return ResponseEntity.ok(
                loanApplicationService.updateApplicationStatus(
                        officerId,
                        applicationId,
                        request
                )
        );
    }

    private void requireRole(String actualRole, String requiredRole) {
        if (!requiredRole.equalsIgnoreCase(actualRole)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to perform this operation"
            );
        }
    }

}
