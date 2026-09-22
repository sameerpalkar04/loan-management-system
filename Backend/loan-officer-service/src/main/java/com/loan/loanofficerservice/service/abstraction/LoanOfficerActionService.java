package com.loan.loanofficerservice.service.abstraction;

import com.loan.loanofficerservice.dto.ApproveLoanRequest;
import com.loan.loanofficerservice.dto.LoanApplicationResponse;
import com.loan.loanofficerservice.dto.RejectLoanRequest;

import java.util.List;

public interface LoanOfficerActionService {

    List<LoanApplicationResponse> viewAllApplications();

    LoanApplicationResponse viewApplicationById(Long applicationId);

    void approveApplication(
            Long officerId,
            Long applicationId,
            ApproveLoanRequest approveLoanRequest
    );

    void rejectApplication(Long officerId, Long applicationId,
                           RejectLoanRequest rejectLoanRequest);
}
