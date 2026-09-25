package com.loan.creditscore.listeners;

import com.loan.creditscore.dtos.SeedCreditScoreCommand;
import com.loan.creditscore.events.CustomerRegisteredEvent;
import com.loan.creditscore.services.implementations.CreditScoreServiceManager;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
// Consumes customer-registration events to provision deterministic credit scores.
public class CustomerRegisteredListener {

    private final CreditScoreServiceManager creditScoreServiceManager;

    public CustomerRegisteredListener(
            CreditScoreServiceManager creditScoreServiceManager) {
        this.creditScoreServiceManager = creditScoreServiceManager;
    }

    @KafkaListener(topics = "customer.registered")
    // Seeds the score associated with the newly registered PAN.
    public void onCustomerRegistered(CustomerRegisteredEvent event) {
        creditScoreServiceManager.add(
                new SeedCreditScoreCommand(event.getPanNumber())
        );
    }
}
