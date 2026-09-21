package com.loan.creditscore.listeners;

import com.loan.creditscore.dtos.SeedCreditScoreCommand;
import com.loan.creditscore.events.CustomerRegisteredEvent;
import com.loan.creditscore.services.implementations.CreditScoreServiceManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CustomerRegisteredListenerTest {

    @Mock
    private CreditScoreServiceManager creditScoreServiceManager;

    @Test
    void onCustomerRegisteredSeedsCreditScoreUsingTheEventPan() {
        CustomerRegisteredEvent event = new CustomerRegisteredEvent();
        event.setCustomerId(42L);
        event.setPanNumber("ABCDE1234F");
        CustomerRegisteredListener listener =
                new CustomerRegisteredListener(creditScoreServiceManager);

        listener.onCustomerRegistered(event);

        ArgumentCaptor<SeedCreditScoreCommand> commandCaptor =
                ArgumentCaptor.forClass(SeedCreditScoreCommand.class);
        verify(creditScoreServiceManager).add(commandCaptor.capture());
        assertEquals("ABCDE1234F", commandCaptor.getValue().getPanNumber());
    }
}
