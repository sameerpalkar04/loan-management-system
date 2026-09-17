package com.loan.loanofficerservice.dao.repository;

import com.loan.loanofficerservice.dao.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {
}
