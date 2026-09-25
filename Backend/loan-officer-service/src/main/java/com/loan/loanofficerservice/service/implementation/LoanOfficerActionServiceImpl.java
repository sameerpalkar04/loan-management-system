package com.loan.loanofficerservice.service.implementation;

import com.loan.loanofficerservice.dto.ApproveLoanRequest;
import com.loan.loanofficerservice.dto.LoanApplicationDecisionRequest;
import com.loan.loanofficerservice.dto.LoanApplicationResponse;
import com.loan.loanofficerservice.dto.RejectLoanRequest;
import com.loan.loanofficerservice.service.abstraction.LoanOfficerActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Service
@RequiredArgsConstructor
// Coordinates officer actions with the application and customer services.
public class LoanOfficerActionServiceImpl implements LoanOfficerActionService {

    private static final String LOAN_APPLICATION_PATH =
            "/api/v1/loan-applications";

    private static final String CUSTOMER_PATH = "/api/customers/";
    private final LoadBalancerClient loadBalancerClient;

    @Override
    // Lists applications after enriching them with applicant details.
    public List<LoanApplicationResponse> viewAllApplications() {
        List<LoanApplicationResponse> applications = client()
                .get()
                .uri(LOAN_APPLICATION_PATH)
                .header("X-User-Role", "LOAN_OFFICER")
                .retrieve()
                .body(new ParameterizedTypeReference<>() { });

        return applications == null ? List.of() : applications.stream()
                .map(this::enrichApplication)
                .toList();
    }

    @Override
    // Retrieves and enriches one application for officer review.
    public LoanApplicationResponse viewApplicationById(Long applicationId) {
        LoanApplicationResponse application = client()
                .get()
                .uri(LOAN_APPLICATION_PATH + "/{applicationId}", applicationId)
                .header("X-User-Role", "LOAN_OFFICER")
                .retrieve()
                .body(LoanApplicationResponse.class);
        return enrichApplication(application);
    }

    @Override
    // Converts an officer approval into the application-service decision request.
    public void approveApplication(
            Long officerId,
            Long applicationId,
            ApproveLoanRequest request) {

        updateDecision(
                officerId,
                applicationId,
                new LoanApplicationDecisionRequest(
                        "APPROVED",
                        null,
                        request.getApprovedPrincipal(),
                        request.getAnnualInterestRate(),
                        request.getTenureMonths(),
                        request.getValuation()
                )
        );
    }

    @Override
    // Converts an officer rejection into the application-service decision request.
    public void rejectApplication(
            Long officerId,
            Long applicationId,
            RejectLoanRequest request) {

        updateDecision(
                officerId,
                applicationId,
                new LoanApplicationDecisionRequest(
                        "REJECTED",
                        request.getDecisionReason().trim(),
                        null,
                        null,
                        null,
                        request.getValuation()
                )
        );
    }

    // Sends a final decision to the application service.
    private void updateDecision(
            Long officerId,
            Long applicationId,
            LoanApplicationDecisionRequest request) {

        client()
                .patch()
                .uri(LOAN_APPLICATION_PATH + "/{applicationId}/status", applicationId)
                .header("X-User-Role", "LOAN_OFFICER")
                .header("X-Officer-Id", officerId.toString())
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    // Creates a load-balanced client for the application service.
    private RestClient client() {
        ServiceInstance instance = loadBalancerClient
                .choose("loan-application-service");

        if (instance == null) {
            throw new IllegalStateException(
                    "loan-application-service is not available in Eureka"
            );
        }

        return RestClient.builder()
                .baseUrl(instance.getUri().toString())
                .build();
    }


    // Adds applicant identity data and masks PANs after final decisions.
    private LoanApplicationResponse enrichApplication(LoanApplicationResponse application) {
        if (application == null || application.getCustomerId() == null) {
            return application;
        }

        CustomerSummary customer = customerClient()
                .get()
                .uri(CUSTOMER_PATH + "{customerId}", application.getCustomerId())
                .retrieve()
                .body(CustomerSummary.class);

        if (customer != null) {
            application.setApplicantName(
                    (customer.firstName() + " " + customer.lastName()).trim());
            application.setPanNumber(panNumberForApplication(
                    customer.panNumber(), application.getStatus()));
        }
        return application;
    }

    // Returns a full PAN for active review or a masked value for history.
    private String panNumberForApplication(String panNumber, String status) {
        if (!isFinalDecision(status)) {
            return panNumber;
        }

        String normalized = panNumber == null ? "" : panNumber.trim().toUpperCase();
        if (normalized.length() < 6) {
            return "Not available";
        }

        return normalized.substring(0, 5) + "****"
                + normalized.substring(normalized.length() - 1);
    }

    // Identifies statuses for which the officer decision is final.
    private boolean isFinalDecision(String status) {
        return "APPROVED".equalsIgnoreCase(status)
                || "REJECTED".equalsIgnoreCase(status);
    }


    // Creates a load-balanced client for the customer service.
    private RestClient customerClient() {
        ServiceInstance instance = loadBalancerClient.choose("customer-service");
        if (instance == null) {
            throw new IllegalStateException("customer-service is not available in Eureka");
        }
        return RestClient.builder().baseUrl(instance.getUri().toString()).build();
    }

    private record CustomerSummary(String firstName, String lastName, String panNumber) { }

    @Override
    public ResponseEntity<byte[]> viewPanCardImage(Long applicationId) {
        return client()
                .get()
                .uri(
                        LOAN_APPLICATION_PATH
                                + "/{applicationId}/pan-card-image",
                        applicationId
                )
                .header("X-User-Role", "LOAN_OFFICER")
                .retrieve()
                .toEntity(byte[].class);
    }
}
