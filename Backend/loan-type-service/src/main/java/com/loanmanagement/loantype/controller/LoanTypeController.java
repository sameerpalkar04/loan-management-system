package com.loanmanagement.loantype.controller;

import com.loanmanagement.loantype.dto.LoanTypeRequest;
import com.loanmanagement.loantype.dto.LoanTypeResponse;
import com.loanmanagement.loantype.service.LoanTypeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/loan-types")
@Validated
// Exposes public loan-product browsing and officer-only catalogue management.
public class LoanTypeController {

    private final LoanTypeService loanTypeService;

    public LoanTypeController(LoanTypeService loanTypeService) {
        this.loanTypeService = loanTypeService;
    }

    @GetMapping
    // Lists all available loan products.
    public ResponseEntity<List<LoanTypeResponse>> getAllLoanTypes() {
        return ResponseEntity.ok(loanTypeService.getAllLoanTypes());
    }

    @GetMapping("/search")
    // Searches loan products by name.
    public ResponseEntity<List<LoanTypeResponse>> searchLoanTypes(
            @RequestParam String name) {

        return ResponseEntity.ok(loanTypeService.searchLoanTypes(name));
    }

    @GetMapping("/{loanTypeId}")
    // Returns one loan product by identifier.
    public ResponseEntity<LoanTypeResponse> getLoanTypeById(
            @PathVariable @Positive(message = "Loan type ID must be greater than zero")
            Long loanTypeId) {

        return ResponseEntity.ok(loanTypeService.getLoanTypeById(loanTypeId));
    }

    @PostMapping
    // Creates a loan product after confirming the caller is an officer.
    public ResponseEntity<LoanTypeResponse> createLoanType(
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody LoanTypeRequest request) {
        requireLoanOfficer(role);

        LoanTypeResponse createdLoanType = loanTypeService.createLoanType(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdLoanType);
    }

    @PutMapping("/{loanTypeId}")
    // Updates an existing loan product after confirming the caller is an officer.
    public ResponseEntity<LoanTypeResponse> updateLoanType(
            @RequestHeader("X-User-Role") String role,
            @PathVariable @Positive(message = "Loan type ID must be greater than zero")
            Long loanTypeId,
            @Valid @RequestBody LoanTypeRequest request) {
        requireLoanOfficer(role);

        return ResponseEntity.ok(
                loanTypeService.updateLoanType(loanTypeId, request));
    }

    @DeleteMapping("/{loanTypeId}")
    // Deletes a loan product after confirming the caller is an officer.
    public ResponseEntity<Void> deleteLoanType(
            @RequestHeader("X-User-Role") String role,
            @PathVariable @Positive(message = "Loan type ID must be greater than zero")
            Long loanTypeId) {
        requireLoanOfficer(role);

        loanTypeService.deleteLoanType(loanTypeId);
        return ResponseEntity.noContent().build();
    }

    // Rejects catalogue mutations from non-officer callers.
    private void requireLoanOfficer(String role) {
        if (!"LOAN_OFFICER".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only loan officers can manage loan types");
        }
    }
}
