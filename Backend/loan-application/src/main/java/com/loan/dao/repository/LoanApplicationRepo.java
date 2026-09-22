package com.loan.dao.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loan.dao.entity.ApplicationStatus;
import com.loan.dao.entity.LoanApplication;

public interface LoanApplicationRepo extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByCustomerIdOrderByAppliedAtDesc(Long customerId);

    List<LoanApplication> findByStatusOrderByAppliedAtAsc(
            ApplicationStatus status
    );

    List<LoanApplication> findAllByOrderByAppliedAtDesc();
}

