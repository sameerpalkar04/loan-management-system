package com.loan.creditscore.daos.repositories;

import com.loan.creditscore.daos.entities.CreditScoreHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface CreditScoreHistoryRepository
        extends JpaRepository<CreditScoreHistory, Long> {

    List<CreditScoreHistory> findByPanNumberOrderByCheckedAtDesc(
            String panNumber
    );

    List<CreditScoreHistory> findByApplicationIdOrderByCheckedAtDesc(
            Long applicationId
    );

    @Query("select distinct history.applicationId from CreditScoreHistory history "
            + "where history.applicationId in :applicationIds")
    List<Long> findViewedApplicationIds(
            @Param("applicationIds") Collection<Long> applicationIds
    );
}
