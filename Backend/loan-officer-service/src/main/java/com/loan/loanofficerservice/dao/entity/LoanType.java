package com.loan.loanofficerservice.dao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "LOAN_TYPE", schema = "SYSTEM")
public class LoanType {

    @Id
    @Column(name = "LOAN_TYPE_ID")
    private Long loanTypeId;

    @Column(name = "LOAN_NAME", nullable = false)
    private String loanName;

    @Column(name = "BASE_INTEREST_RATE", nullable = false, precision = 5, scale = 2)
    private BigDecimal baseInterestRate;

    @Column(name = "MAXIMUM_TENURE_MONTHS", nullable = false)
    private Integer maximumTenureMonths;

    @Column(name = "MAXIMUM_LOAN_AMOUNT", nullable = false, precision = 15, scale = 2)
    private BigDecimal maximumLoanAmount;

    @Column(name = "DESCRIPTION")
    private String description;
}
