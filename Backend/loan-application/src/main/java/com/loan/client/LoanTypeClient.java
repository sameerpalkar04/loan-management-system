package com.loan.client;

import com.loan.dto.LoanTypeLimitResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class LoanTypeClient {

    private final RestClient restClient;

    public LoanTypeClient(
            @Value("${loan-type-service.base-url}") String loanTypeServiceBaseUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(loanTypeServiceBaseUrl)
                .build();
    }

    public LoanTypeLimitResponse getLoanTypeLimits(Long loanTypeId) {
        return restClient.get()
                .uri("/api/loan-types/{loanTypeId}", loanTypeId)
                .retrieve()
                .body(LoanTypeLimitResponse.class);
    }
}
