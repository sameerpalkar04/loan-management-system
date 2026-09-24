package com.loan.customerservice.services.implementations;

import com.loan.customerservice.daos.entities.Customer;
import com.loan.customerservice.daos.repositories.CustomerRepository;
import com.loan.customerservice.dtos.CustomerRegistrationCommand;
import com.loan.customerservice.events.CustomerRegisteredEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceManagerTest {

    @Mock
    private CustomerRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private KafkaTemplate<String, CustomerRegisteredEvent> kafkaTemplate;

    @Test
    void addPublishesCustomerRegisteredEventAfterSavingCustomer() {
        CustomerRegistrationCommand command = new CustomerRegistrationCommand(
                "Asha", "Patel", LocalDate.of(1995, 1, 1),
                "asha@example.com", "password", "abcde1234f", "Salaried",
                new BigDecimal("50000")
        );
        Customer savedCustomer = new Customer();
        savedCustomer.setCustomerId(42L);
        savedCustomer.setPanNumber("ABCDE1234F");

        when(repository.findByEmail("asha@example.com")).thenReturn(Optional.empty());
        when(repository.existsByPanNumber("ABCDE1234F")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(repository.save(any(Customer.class))).thenReturn(savedCustomer);

        CustomerServiceManager service = new CustomerServiceManager(
                repository, passwordEncoder, kafkaTemplate
        );

        service.add(command);

        ArgumentCaptor<CustomerRegisteredEvent> eventCaptor =
                ArgumentCaptor.forClass(CustomerRegisteredEvent.class);
        verify(kafkaTemplate).send(
                org.mockito.ArgumentMatchers.eq("customer.registered"),
                org.mockito.ArgumentMatchers.eq("ABCDE1234F"),
                eventCaptor.capture()
        );
        assertEquals(42L, eventCaptor.getValue().getCustomerId());
        assertEquals("ABCDE1234F", eventCaptor.getValue().getPanNumber());
    }

    @Test
    void addStillReturnsTheCustomerWhenKafkaIsUnavailable() {
        CustomerRegistrationCommand command = new CustomerRegistrationCommand(
                "Asha", "Patel", LocalDate.of(1995, 1, 1),
                "asha@example.com", "password", "abcde1234f", "Salaried",
                new BigDecimal("50000")
        );
        Customer savedCustomer = new Customer();
        savedCustomer.setCustomerId(42L);
        savedCustomer.setEmail("asha@example.com");
        savedCustomer.setPanNumber("ABCDE1234F");

        when(repository.findByEmail("asha@example.com")).thenReturn(Optional.empty());
        when(repository.existsByPanNumber("ABCDE1234F")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(repository.save(any(Customer.class))).thenReturn(savedCustomer);
        when(kafkaTemplate.send(
                org.mockito.ArgumentMatchers.eq("customer.registered"),
                org.mockito.ArgumentMatchers.eq("ABCDE1234F"),
                any(CustomerRegisteredEvent.class)
        )).thenThrow(new RuntimeException("Send failed"));

        CustomerServiceManager service = new CustomerServiceManager(
                repository, passwordEncoder, kafkaTemplate
        );

        assertDoesNotThrow(() -> service.add(command));
    }
}
