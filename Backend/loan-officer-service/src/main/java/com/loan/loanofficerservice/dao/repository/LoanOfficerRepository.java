package com.loan.loanofficerservice.dao.repository;

import com.loan.loanofficerservice.dao.entity.LoanOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanOfficerRepository extends JpaRepository<LoanOfficer, Long> {
    Optional<LoanOfficer> findByOfficerEmail(String officerEmail);

    boolean existsByOfficerEmail(String officerEmail);
}
