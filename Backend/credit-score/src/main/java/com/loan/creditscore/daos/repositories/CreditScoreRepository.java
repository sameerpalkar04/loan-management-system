package com.loan.creditscore.daos.repositories;

import com.loan.creditscore.daos.entities.CreditScore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditScoreRepository
        extends JpaRepository<CreditScore, String> {
}