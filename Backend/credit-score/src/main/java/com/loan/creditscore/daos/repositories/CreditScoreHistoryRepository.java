package com.loan.creditscore.daos.repositories;

import com.loan.creditscore.daos.entities.CreditScoreHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreditScoreHistoryRepository
        extends JpaRepository<CreditScoreHistory, Long> {

    List<CreditScoreHistory> findByPanNumberOrderByCheckedAtDesc(
            String panNumber
    );

    List<CreditScoreHistory> findByApplicationIdOrderByCheckedAtDesc(
            Long applicationId
    );
}
