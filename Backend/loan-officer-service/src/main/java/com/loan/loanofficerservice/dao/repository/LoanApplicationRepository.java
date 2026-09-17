package com.loan.loanofficerservice.dao.repository;

import com.loan.loanofficerservice.dao.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
}
