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
            ApproveLoanRequest approveLoanRequest,
            Long loanOfficerId
    );

    void rejectApplication(
            Long applicationId,
            RejectLoanRequest rejectLoanRequest,
            Long loanOfficerId
    );

    void updateLoanType(
            Long loanTypeId,
            LoanTypeUpdateRequest loanTypeUpdateRequest,
            Long loanOfficerId
    );

    void deleteCustomer(
            Long customerId,
            Long loanOfficerId
    );
}