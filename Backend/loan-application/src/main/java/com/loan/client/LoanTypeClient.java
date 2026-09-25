package com.loan.client;

import com.loan.dto.response.LoanTypeLimitResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
// Retrieves product lending limits from the loan-type service.
public class LoanTypeClient {

    private final RestClient restClient;

    public LoanTypeClient(
            @Value("${loan-type-service.base-url}") String loanTypeServiceBaseUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(loanTypeServiceBaseUrl)
                .build();
    }

    // Fetches the constraints for the selected loan product.
    public LoanTypeLimitResponse getLoanTypeLimits(Long loanTypeId) {
        return restClient.get()
                .uri("/api/loan-types/{loanTypeId}", loanTypeId)
                .retrieve()
                .body(LoanTypeLimitResponse.class);
    }
}
