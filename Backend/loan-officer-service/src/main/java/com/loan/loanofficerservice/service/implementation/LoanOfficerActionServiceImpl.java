package com.loan.loanofficerservice.service.implementation;

import com.loan.loanofficerservice.dao.entity.Customer;
import com.loan.loanofficerservice.dao.entity.LoanApplication;
import com.loan.loanofficerservice.dao.entity.LoanType;
import com.loan.loanofficerservice.dao.repository.CustomerRepository;
import com.loan.loanofficerservice.dao.repository.LoanApplicationRepository;
import com.loan.loanofficerservice.dao.repository.LoanTypeRepository;
import com.loan.loanofficerservice.dto.ApproveLoanRequest;
import com.loan.loanofficerservice.dto.LoanApplicationResponse;
import com.loan.loanofficerservice.dto.LoanTypeUpdateRequest;
import com.loan.loanofficerservice.dto.RejectLoanRequest;
import com.loan.loanofficerservice.exception.CustomerNotFoundException;
import com.loan.loanofficerservice.exception.LoanApplicationNotFoundException;
import com.loan.loanofficerservice.service.abstraction.LoanOfficerActionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanOfficerActionServiceImpl implements LoanOfficerActionService {

    private final CustomerRepository customerRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanTypeRepository loanTypeRepository;

    @Override
    public List<LoanApplicationResponse> viewAllApplications() {
        return loanApplicationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public LoanApplicationResponse viewApplicationById(Long applicationId) {
        return toResponse(getApplication(applicationId));
    }

    @Override
    public void approveApplication(
            Long applicationId,
            ApproveLoanRequest approveLoanRequest
    ) {
        LoanApplication application = getApplication(applicationId);
        application.setStatus("APPROVED");
        application.setReviewedAt(LocalDateTime.now());
        application.setValuation(approveLoanRequest.getValuation());
        loanApplicationRepository.save(application);
    }

    @Override
    public void rejectApplication(Long applicationId,
                                  RejectLoanRequest rejectLoanRequest
    ) {
        LoanApplication application = getApplication(applicationId);
        application.setStatus("REJECTED");
        application.setReviewedAt(LocalDateTime.now());
        application.setValuation(rejectLoanRequest.getValuation());
        loanApplicationRepository.save(application);
    }

    @Override
    public void updateLoanType(Long loanTypeId,
                               LoanTypeUpdateRequest loanTypeUpdateRequest
    ) {
        LoanType loanType = loanTypeRepository.findById(loanTypeId)
                .orElseThrow(() -> new LoanApplicationNotFoundException(
                        "Loan type not found: " + loanTypeId
                ));
        loanType.setLoanName(loanTypeUpdateRequest.getLoanName());
        loanType.setBaseInterestRate(loanTypeUpdateRequest.getBaseInterestRate());
        loanType.setMaximumTenureMonths(
                loanTypeUpdateRequest.getMaximumTenureMonths()
        );
        loanType.setMaximumLoanAmount(loanTypeUpdateRequest.getMaximumLoanAmount());
        loanType.setDescription(loanTypeUpdateRequest.getDescription());
        loanTypeRepository.save(loanType);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long customerId) {

        Customer customer = customerRepository.findCustomerForDeletion(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "Customer not found: " + customerId
                ));

        customerRepository.delete(customer);
        customerRepository.flush();

    }

    private LoanApplication getApplication(Long applicationId) {
        return loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new LoanApplicationNotFoundException(
                        "Loan application not found: " + applicationId
                ));
    }

    private LoanApplicationResponse toResponse(LoanApplication application) {
        return new LoanApplicationResponse(
                application.getApplicationId(),
                application.getCustomerId(),
                application.getLoanTypeId(),
                application.getReviewedByOfficerId(),
                application.getRequestedAmount(),
                application.getRequestedTenureMonths(),
                application.getStatus(),
                application.getAppliedAt(),
                application.getReviewedAt(),
                application.getValuation()
        );
    }
}
