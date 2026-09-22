package com.loan.customerservice.daos.repositories;

import com.loan.customerservice.daos.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    boolean existsByPanNumber(String panNumber);
}