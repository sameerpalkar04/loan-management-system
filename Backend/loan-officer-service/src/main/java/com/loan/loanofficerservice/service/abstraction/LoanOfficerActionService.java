package com.loan.loanofficerservice.service.abstraction;

import com.loan.loanofficerservice.dto.ApproveLoanRequest;
import com.loan.loanofficerservice.dto.LoanApplicationResponse;
import com.loan.loanofficerservice.dto.LoanTypeUpdateRequest;
import com.loan.loanofficerservice.dto.RejectLoanRequest;

import java.util.List;

public interface LoanOfficerActionService {

    List<LoanApplicationResponse> viewAllApplications();

    LoanApplicationResponse viewApplicationById(Long applicationId);

    void approveApplication(
            Long applicationId,
            ApproveLoanRequest approveLoanRequest
    );

    void rejectApplication(
            Long applicationId,
            RejectLoanRequest rejectLoanRequest
    );

    void updateLoanType(
            Long loanTypeId,
            LoanTypeUpdateRequest loanTypeUpdateRequest
    );

    void deleteCustomer(Long customerId);
}
