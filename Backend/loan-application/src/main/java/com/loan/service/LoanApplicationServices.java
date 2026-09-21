package com.loan.service;

import java.util.List;

import com.loan.dto.request.CreateLoanApplicationRequest;
import com.loan.dto.request.UpdateApplicationStatus;
import com.loan.dto.response.LoanApplicationResponse;
import org.springframework.web.multipart.MultipartFile;

public interface LoanApplicationServices {

    LoanApplicationResponse createApplication(
            Long customerId,
            CreateLoanApplicationRequest request,
            MultipartFile panCardImage);

    LoanApplicationResponse getApplicationById(
            Long applicationId
    );

    List<LoanApplicationResponse> getCustomerApplications(
            Long customerId
    );

    List<LoanApplicationResponse> getAllApplications();

    List<LoanApplicationResponse> getPendingApplications();

    LoanApplicationResponse updateApplicationStatus(
            Long officerId,
            Long applicationId,
            UpdateApplicationStatus request
    );
}