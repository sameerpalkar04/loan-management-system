
package com.loan.loanofficerservice.dao.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "CUSTOMER", schema = "SYSTEM")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSTOMER_ID")
    private Long customerId;

    @Column(name = "FIRST_NAME", nullable = false, length = 100)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = false, length = 100)
    private String lastName;

    @Column(name = "DATE_OF_BIRTH", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "PAN_NUMBER", nullable = false, unique = true, length = 10)
    private String panNumber;

    @Column(name = "EMPLOYMENT_TYPE", nullable = false, length = 30)
    private String employmentType;

    @Column(name = "MONTHLY_INCOME", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    public Customer() {
    }

    public Customer(String firstName, String lastName, LocalDate dateOfBirth,
                    String email, String password, String panNumber,
                    String employmentType, BigDecimal monthlyIncome) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.panNumber = panNumber;
        this.employmentType = employmentType;
        this.monthlyIncome = monthlyIncome;
    }

    @PrePersist
    @PreUpdate
    public void normalizeFields() {
        if (email != null) {
            email = email.trim().toLowerCase();
        }

        if (panNumber != null) {
            panNumber = panNumber.trim().toUpperCase();
        }
    }

}
