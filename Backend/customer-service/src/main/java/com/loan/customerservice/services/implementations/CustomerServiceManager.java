package com.loan.customerservice.services.implementations;

import com.loan.customerservice.daos.entities.Customer;
import com.loan.customerservice.daos.repositories.CustomerRepository;
import com.loan.customerservice.dtos.CustomerQuery;
import com.loan.customerservice.dtos.CustomerRegistrationCommand;
import com.loan.customerservice.events.CustomerRegisteredEvent;
import com.loan.customerservice.exceptions.CustomerAlreadyExistsException;
import com.loan.customerservice.services.abstractions.ServiceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

@Service
public class CustomerServiceManager
        implements ServiceManager<CustomerRegistrationCommand, CustomerQuery, Long> {

    private final CustomerRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final KafkaTemplate<String, CustomerRegisteredEvent> kafkaTemplate;

    @Autowired
    public CustomerServiceManager(CustomerRepository repository,
                                  PasswordEncoder passwordEncoder,
                                  KafkaTemplate<String, CustomerRegisteredEvent> kafkaTemplate) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public CustomerQuery add(CustomerRegistrationCommand data) {

        String email = data.getEmail().trim().toLowerCase(Locale.ROOT);
        String panNumber = data.getPanNumber().trim().toUpperCase(Locale.ROOT);

        if (repository.findByEmail(email).isPresent()) {
            throw new CustomerAlreadyExistsException(
                    "Email is already registered"
            );
        }

        if (repository.existsByPanNumber(panNumber)) {
            throw new CustomerAlreadyExistsException(
                    "PAN number is already registered"
            );
        }

        Customer customer = new Customer();
        customer.setFirstName(data.getFirstName().trim());
        customer.setLastName(data.getLastName().trim());
        customer.setDateOfBirth(data.getDateOfBirth());
        customer.setEmail(email);
        customer.setPassword(passwordEncoder.encode(data.getPassword()));
        customer.setPanNumber(panNumber);
        customer.setEmploymentType(data.getEmploymentType().trim());
        customer.setMonthlyIncome(data.getMonthlyIncome());

        Customer addedCustomer = repository.save(customer);
        kafkaTemplate.send(
                "customer.registered",
                addedCustomer.getPanNumber(),
                new CustomerRegisteredEvent(
                        addedCustomer.getCustomerId(),
                        addedCustomer.getPanNumber()
                )
        );

        return mapToCustomerQuery(addedCustomer);
    }

    @Override
    public Collection<CustomerQuery> getAll() {

        List<Customer> customers = repository.findAll();
        Collection<CustomerQuery> customerQueries = new ArrayList<>();

        customers.forEach(customer ->
                customerQueries.add(mapToCustomerQuery(customer))
        );

        return customerQueries;
    }

    @Override
    public CustomerQuery get(Long id) {
        return repository.findById(id)
                .map(this::mapToCustomerQuery)
                .orElse(null);
    }

    @Override
    public CustomerQuery delete(Long id) {
        return null;
    }

    @Override
    public CustomerQuery update(Long id, CustomerRegistrationCommand data) {
        return null;
    }

    private CustomerQuery mapToCustomerQuery(Customer customer) {

        CustomerQuery query = new CustomerQuery();
        query.setCustomerId(customer.getCustomerId());
        query.setFirstName(customer.getFirstName());
        query.setLastName(customer.getLastName());
        query.setDateOfBirth(customer.getDateOfBirth());
        query.setEmail(customer.getEmail());
        query.setPanNumber(customer.getPanNumber());
        query.setEmploymentType(customer.getEmploymentType());
        query.setMonthlyIncome(customer.getMonthlyIncome());

        return query;
    }
}
