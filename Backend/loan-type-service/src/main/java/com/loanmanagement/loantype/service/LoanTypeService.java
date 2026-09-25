package com.loanmanagement.loantype.service;

import com.loanmanagement.loantype.dto.LoanTypeRequest;
import com.loanmanagement.loantype.dto.LoanTypeResponse;
import com.loanmanagement.loantype.entity.LoanType;
import com.loanmanagement.loantype.exception.LoanTypeNotFoundException;
import com.loanmanagement.loantype.repository.LoanTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
// Implements catalogue browsing and administration for loan products.
public class LoanTypeService {

    private final LoanTypeRepository loanTypeRepository;

    public LoanTypeService(LoanTypeRepository loanTypeRepository) {
        this.loanTypeRepository = loanTypeRepository;
    }

    // Returns every configured loan product.
    public List<LoanTypeResponse> getAllLoanTypes() {
        return loanTypeRepository.findAll()
                .stream()
                .map(LoanTypeResponse::fromEntity)
                .toList();
    }

    // Returns one product or raises a not-found error.
    public LoanTypeResponse getLoanTypeById(Long loanTypeId) {
        return loanTypeRepository.findById(loanTypeId)
                .map(LoanTypeResponse::fromEntity)
                .orElseThrow(() -> new LoanTypeNotFoundException(
                        "Loan type not found with id: " + loanTypeId));
    }

    // Searches products using a case-insensitive name match.
    public List<LoanTypeResponse> searchLoanTypes(String loanName) {
        return loanTypeRepository.findByLoanNameContainingIgnoreCase(loanName)
                .stream()
                .map(LoanTypeResponse::fromEntity)
                .toList();
    }

    // Persists a newly defined loan product.
    public LoanTypeResponse createLoanType(LoanTypeRequest request) {
        LoanType loanType = new LoanType();
        updateLoanTypeFields(loanType, request);

        LoanType savedLoanType = loanTypeRepository.save(loanType);
        return LoanTypeResponse.fromEntity(savedLoanType);
    }

    // Updates the mutable properties of an existing loan product.
    public LoanTypeResponse updateLoanType(
            Long loanTypeId,
            LoanTypeRequest request) {

        LoanType loanType = loanTypeRepository.findById(loanTypeId)
                .orElseThrow(() -> new LoanTypeNotFoundException(
                        "Loan type not found with id: " + loanTypeId));

        updateLoanTypeFields(loanType, request);

        LoanType updatedLoanType = loanTypeRepository.save(loanType);
        return LoanTypeResponse.fromEntity(updatedLoanType);
    }

    @Transactional
    // Removes a loan product after confirming it exists.
    public void deleteLoanType(Long loanTypeId) {
        LoanType loanType = loanTypeRepository.findById(loanTypeId)
                .orElseThrow(() -> new LoanTypeNotFoundException(
                        "Loan type not found with id: " + loanTypeId));

        loanTypeRepository.delete(loanType);
        loanTypeRepository.flush();
    }

    // Copies validated request values into a managed loan-product entity.
    private void updateLoanTypeFields(
            LoanType loanType,
            LoanTypeRequest request) {

        loanType.setLoanName(request.getLoanName());
        loanType.setBaseInterestRate(request.getBaseInterestRate());
        loanType.setMaximumTenureMonths(request.getMaximumTenureMonths());
        loanType.setDescription(request.getDescription());
        loanType.setMaximumLoanAmount(request.getMaximumLoanAmount());
        loanType.setCollateralRequired(request.getCollateralRequired());
        loanType.setMaximumLtvPercentage(
                Boolean.TRUE.equals(request.getCollateralRequired())
                        ? request.getMaximumLtvPercentage()
                        : null
        );
    }
}
