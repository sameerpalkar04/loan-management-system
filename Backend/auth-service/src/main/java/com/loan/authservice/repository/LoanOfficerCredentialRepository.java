package com.loan.authservice.repository;

import com.loan.authservice.entity.LoanOfficerCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanOfficerCredentialRepository extends JpaRepository<LoanOfficerCredential, Long> {
    Optional<LoanOfficerCredential> findByEmailIgnoreCase(String email);
}
