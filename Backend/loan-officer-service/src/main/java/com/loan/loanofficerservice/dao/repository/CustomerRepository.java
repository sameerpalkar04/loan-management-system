package com.loan.loanofficerservice.dao.repository;

import com.loan.loanofficerservice.dao.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query(
            value = "SELECT * FROM SYSTEM.CUSTOMER WHERE CUSTOMER_ID = :customerId",
            nativeQuery = true
    )
    Optional<Customer> findCustomerForDeletion(
            @Param("customerId") Long customerId
    );
}
