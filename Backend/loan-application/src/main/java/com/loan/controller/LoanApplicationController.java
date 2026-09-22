package com.loan.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.loan.dto.request.CreateLoanApplicationRequest;
import com.loan.dto.request.UpdateApplicationStatus;
import com.loan.dto.response.LoanApplicationResponse;
import com.loan.service.LoanApplicationServices;
import com.loan.dto.response.PanCardImageResponse;

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
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateLoanApplicationRequest request) {

<<<<<<< HEAD
        Long customerId = requiredLongClaim(jwt, "customer_id");
=======
            @Valid
            @RequestPart("application")
            CreateLoanApplicationRequest request,

            @RequestPart("panCardImage")
            MultipartFile panCardImage
    ) {
        requireRole(role, "CUSTOMER");
>>>>>>> f99ff8d (Backup current loan management system)

        LoanApplicationResponse response =
                loanApplicationService.createApplication(
                        customerId,
                        request
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<LoanApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal Jwt jwt) {

        Long customerId = requiredLongClaim(jwt, "customer_id");

        return ResponseEntity.ok(
                loanApplicationService.getCustomerApplications(customerId)
        );
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(
                loanApplicationService.getAllApplications()
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LoanApplicationResponse>> getPendingApplications() {
        return ResponseEntity.ok(
                loanApplicationService.getPendingApplications()
        );
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<LoanApplicationResponse> getApplicationById(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                loanApplicationService.getApplicationById(applicationId)
        );
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<LoanApplicationResponse> updateApplicationStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateApplicationStatus request) {

        Long officerId = requiredLongClaim(jwt, "officer_id");

        return ResponseEntity.ok(
                loanApplicationService.updateApplicationStatus(
                        officerId,
                        applicationId,
                        request
                )
        );
    }

    private Long requiredLongClaim(Jwt jwt, String claimName) {
        Object claim = jwt.getClaim(claimName);

<<<<<<< HEAD
        if (claim instanceof Number number) {
            return number.longValue();
        }

        if (claim instanceof String value) {
            try {
                return Long.valueOf(value);
            } catch (NumberFormatException exception) {
                throw new IllegalArgumentException(
                        "JWT claim " + claimName + " must be numeric"
                );
            }
        }

        throw new IllegalArgumentException(
                "JWT is missing required claim: " + claimName
        );
    }
}
=======
    @GetMapping("/{applicationId}/pan-card-image")
    public ResponseEntity<byte[]> getPanCardImage(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long applicationId
    ) {
        requireRole(role, "LOAN_OFFICER");

        PanCardImageResponse image =
                loanApplicationService.getPanCardImage(applicationId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.contentType()))
                .body(image.imageBytes());
    }
}
>>>>>>> f99ff8d (Backup current loan management system)
