package com.loan.authservice.repository;

import com.loan.authservice.entity.CustomerCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerCredentialRepository extends JpaRepository<CustomerCredential, Long> {
    Optional<CustomerCredential> findByEmailIgnoreCase(String email);
}
