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
public class LoanTypeService {

    private final LoanTypeRepository loanTypeRepository;

    public LoanTypeService(LoanTypeRepository loanTypeRepository) {
        this.loanTypeRepository = loanTypeRepository;
    }

    public List<LoanTypeResponse> getAllLoanTypes() {
        return loanTypeRepository.findAll()
                .stream()
                .map(LoanTypeResponse::fromEntity)
                .toList();
    }

    public LoanTypeResponse getLoanTypeById(Long loanTypeId) {
        return loanTypeRepository.findById(loanTypeId)
                .map(LoanTypeResponse::fromEntity)
                .orElseThrow(() -> new LoanTypeNotFoundException(
                        "Loan type not found with id: " + loanTypeId));
    }

    public List<LoanTypeResponse> searchLoanTypes(String loanName) {
        return loanTypeRepository.findByLoanNameContainingIgnoreCase(loanName)
                .stream()
                .map(LoanTypeResponse::fromEntity)
                .toList();
    }

    public LoanTypeResponse createLoanType(LoanTypeRequest request) {
        LoanType loanType = new LoanType();
        updateLoanTypeFields(loanType, request);

        LoanType savedLoanType = loanTypeRepository.save(loanType);
        return LoanTypeResponse.fromEntity(savedLoanType);
    }

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
    public void deleteLoanType(Long loanTypeId) {
        LoanType loanType = loanTypeRepository.findById(loanTypeId)
                .orElseThrow(() -> new LoanTypeNotFoundException(
                        "Loan type not found with id: " + loanTypeId));

        loanTypeRepository.delete(loanType);
        loanTypeRepository.flush();
    }

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
