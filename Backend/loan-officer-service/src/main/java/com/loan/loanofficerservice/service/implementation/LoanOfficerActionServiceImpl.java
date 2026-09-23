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

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanOfficerActionServiceImpl implements LoanOfficerActionService {

    private static final String LOAN_APPLICATION_PATH =
            "/api/v1/loan-applications";

    private static final String CUSTOMER_PATH = "/api/customers/";
    private final LoadBalancerClient loadBalancerClient;

    @Override
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
    public void rejectApplication(
            Long officerId,
            Long applicationId,
            RejectLoanRequest request) {

        updateDecision(
                officerId,
                applicationId,
                new LoanApplicationDecisionRequest(
                        "REJECTED",
                        null,
                        null,
                        null,
                        null,
                        request.getValuation()
                )
        );
    }

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
            application.setPanNumber(customer.panNumber());
        }
        return application;
    }


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
