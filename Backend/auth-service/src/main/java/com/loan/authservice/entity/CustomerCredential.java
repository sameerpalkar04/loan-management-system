package com.loan.authservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Read-only authentication view of the existing CUSTOMER table.
 * Customer profile creation remains owned by customer-service.
 */
@Entity
@Table(name = "customer")
public class CustomerCredential {

    @Id
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String passwordHash;

    public Long getCustomerId() { return customerId; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
}
