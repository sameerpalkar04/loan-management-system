package com.loan.creditscore.listeners;

import com.loan.creditscore.dtos.SeedCreditScoreCommand;
import com.loan.creditscore.events.CustomerRegisteredEvent;
import com.loan.creditscore.services.implementations.CreditScoreServiceManager;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class CustomerRegisteredListener {

    private final CreditScoreServiceManager creditScoreServiceManager;

    public CustomerRegisteredListener(
            CreditScoreServiceManager creditScoreServiceManager) {
        this.creditScoreServiceManager = creditScoreServiceManager;
    }

    @KafkaListener(topics = "customer.registered")
    public void onCustomerRegistered(CustomerRegisteredEvent event) {
        creditScoreServiceManager.add(
                new SeedCreditScoreCommand(event.getPanNumber())
        );
    }
}
