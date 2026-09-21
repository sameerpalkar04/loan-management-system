package com.loanmanagement.loantype.repository;

import com.loanmanagement.loantype.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {

    List<LoanType> findByLoanNameContainingIgnoreCase(String loanName);
}