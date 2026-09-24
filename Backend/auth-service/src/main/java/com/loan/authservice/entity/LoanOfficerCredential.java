package com.loan.authservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Read-only authentication view of the existing LOAN_OFFICER table.
 */
@Entity
@Table(name = "loan_officer")
public class LoanOfficerCredential {

    @Id
    @Column(name = "loan_officer_id")
    private Long officerId;

    @Column(name = "officer_email")
    private String email;

    @Column(name = "officer_name")
    private String name;

    @Column(name = "officer_password")
    private String passwordHash;

    public Long getOfficerId() { return officerId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getPasswordHash() { return passwordHash; }
}
