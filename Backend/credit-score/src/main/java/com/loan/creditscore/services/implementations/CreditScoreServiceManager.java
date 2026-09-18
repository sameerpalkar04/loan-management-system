package com.loan.creditscore.services.implementations;

import com.loan.creditscore.daos.entities.CreditScore;
import com.loan.creditscore.daos.entities.CreditScoreHistory;
import com.loan.creditscore.daos.repositories.CreditScoreHistoryRepository;
import com.loan.creditscore.daos.repositories.CreditScoreRepository;
import com.loan.creditscore.dtos.CheckCreditScoreCommand;
import com.loan.creditscore.dtos.CreditScoreQuery;
import com.loan.creditscore.dtos.SeedCreditScoreCommand;
import com.loan.creditscore.exceptions.CreditScoreNotFoundException;
import com.loan.creditscore.generators.MockCreditScoreGenerator;
import com.loan.creditscore.services.abstractions.ServiceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

@Service
public class CreditScoreServiceManager
        implements ServiceManager<SeedCreditScoreCommand, CreditScoreQuery, String> {

    private final CreditScoreRepository creditScoreRepository;
    private final CreditScoreHistoryRepository creditScoreHistoryRepository;
    private final MockCreditScoreGenerator mockCreditScoreGenerator;

    @Autowired
    public CreditScoreServiceManager(
            CreditScoreRepository creditScoreRepository,
            CreditScoreHistoryRepository creditScoreHistoryRepository,
            MockCreditScoreGenerator mockCreditScoreGenerator) {

        this.creditScoreRepository = creditScoreRepository;
        this.creditScoreHistoryRepository = creditScoreHistoryRepository;
        this.mockCreditScoreGenerator = mockCreditScoreGenerator;
    }

    /*
     * Called after Customer Service registers a new customer.
     * If a score already exists for the PAN, it returns the existing score.
     */
    @Override
    public CreditScoreQuery add(SeedCreditScoreCommand command) {

        String panNumber = normalizePanNumber(command.getPanNumber());

        CreditScore creditScore = creditScoreRepository
                .findById(panNumber)
                .orElseGet(() -> {

                    Integer generatedScore =
                            mockCreditScoreGenerator.generateScore(panNumber);

                    CreditScore newCreditScore = new CreditScore();
                    newCreditScore.setPanNumber(panNumber);
                    newCreditScore.setScore(generatedScore);

                    return creditScoreRepository.save(newCreditScore);
                });

        return mapToCreditScoreQuery(creditScore);
    }

    /*
     * Called when a loan officer checks a customer's score.
     * It returns the current score and adds one log row to CREDIT_SCORE_HISTORY.
     */
    public CreditScoreQuery checkCreditScore(
            CheckCreditScoreCommand command) {

        String panNumber = normalizePanNumber(command.getPanNumber());

        CreditScore creditScore = creditScoreRepository
                .findById(panNumber)
                .orElseThrow(() -> new CreditScoreNotFoundException(
                        "Credit score not found for PAN number: " + panNumber
                ));

        CreditScoreHistory history = new CreditScoreHistory();
        history.setPanNumber(creditScore.getPanNumber());
        history.setScore(creditScore.getScore());
        history.setLoanOfficerId(command.getLoanOfficerId());
        history.setOfficerName(command.getOfficerName().trim());
        history.setApplicationId(command.getApplicationId());

        creditScoreHistoryRepository.save(history);

        return mapToCreditScoreQuery(creditScore);
    }

    @Override
    public Collection<CreditScoreQuery> getAll() {

        List<CreditScore> creditScores = creditScoreRepository.findAll();

        Collection<CreditScoreQuery> creditScoreQueries = new ArrayList<>();

        creditScores.forEach(creditScore ->
                creditScoreQueries.add(
                        mapToCreditScoreQuery(creditScore)
                )
        );

        return creditScoreQueries;
    }

    @Override
    public CreditScoreQuery get(String panNumber) {

        String normalizedPanNumber = normalizePanNumber(panNumber);

        return creditScoreRepository
                .findById(normalizedPanNumber)
                .map(this::mapToCreditScoreQuery)
                .orElseThrow(() -> new CreditScoreNotFoundException(
                        "Credit score not found for PAN number: "
                                + normalizedPanNumber
                ));
    }

    @Override
    public CreditScoreQuery delete(String panNumber) {
        return null;
    }

    @Override
    public CreditScoreQuery update(
            String panNumber,
            SeedCreditScoreCommand command) {
        return null;
    }

    private CreditScoreQuery mapToCreditScoreQuery(
            CreditScore creditScore) {

        CreditScoreQuery query = new CreditScoreQuery();

        query.setPanNumber(creditScore.getPanNumber());
        query.setScore(creditScore.getScore());
        query.setCheckedAt(creditScore.getCheckedAt());

        return query;
    }

    private String normalizePanNumber(String panNumber) {
        return panNumber.trim().toUpperCase(Locale.ROOT);
    }
}