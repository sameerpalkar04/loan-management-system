package com.loan.loanofficerservice.dao.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "LOAN_OFFICER")
public class LoanOfficer {

    @Id
    @Column(name = "loan_officer_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanOfficerId;

    @Column(name = "officer_name", nullable = false, length = 200)
    private String officerName;

    @Column(name = "officer_email", nullable = false, unique = true, length = 255)
    private String officerEmail;

    @Column(name = "officer_password", nullable = false, length = 255)
    private String officerPassword;

    // Default Constructor
    public LoanOfficer() {

    }

    // Parameterised Constructor

    public LoanOfficer(Long loanOfficerId, String officerName, String officerEmail, String officerPassword) {
        this.loanOfficerId = loanOfficerId;
        this.officerName = officerName;
        this.officerEmail = officerEmail;
        this.officerPassword = officerPassword;
    }

    // getters and setters
    @Override
    public String toString() {
        return "Id: " + getLoanOfficerId() + " , Name: " + getOfficerName();
    }
}
