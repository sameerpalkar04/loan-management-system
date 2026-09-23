package com.loan.service;

import java.util.List;

import com.loan.dto.request.CalculateInterestRateRequest;
import com.loan.dto.request.CreateLoanApplicationRequest;
import com.loan.dto.request.UpdateApplicationStatus;
import com.loan.dto.response.InterestRateCalculationResponse;
import com.loan.dto.response.LoanApplicationResponse;
import org.springframework.web.multipart.MultipartFile;
import com.loan.dto.response.PanCardImageResponse;

public interface LoanApplicationServices {

    LoanApplicationResponse createApplication(
            Long customerId,
            CreateLoanApplicationRequest request,
            MultipartFile panCardImage);

    InterestRateCalculationResponse calculateInterestRate(
            CalculateInterestRateRequest request);

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

    PanCardImageResponse getPanCardImage(Long applicationId);
}
