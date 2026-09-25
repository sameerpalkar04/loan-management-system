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
// Manages mock credit scores and the audit trail for officer lookups.
public class CreditScoreServiceManager
        implements ServiceManager<SeedCreditScoreCommand, CreditScoreQuery, String> {

    private static final String CREDIT_HISTORY_VIEWED = "CREDIT_HISTORY_VIEWED";

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
    // Seeds a score for a newly registered customer's PAN.
    public CreditScoreQuery add(SeedCreditScoreCommand command) {

        String panNumber = normalizePanNumber(command.getPanNumber());

        CreditScore creditScore = getOrCreateCreditScore(panNumber);

        return mapToCreditScoreQuery(creditScore);
    }

    /*
     * Called when a loan officer checks a customer's score.
     * It returns the current score and adds one log row to CREDIT_SCORE_HISTORY.
     */
    public CreditScoreQuery checkCreditScore(
            CheckCreditScoreCommand command) {

        String panNumber = normalizePanNumber(command.getPanNumber());

        CreditScore creditScore = getOrCreateCreditScore(panNumber);

        CreditScoreHistory history = new CreditScoreHistory();
        history.setPanNumber(creditScore.getPanNumber());
        history.setScore(creditScore.getScore());
        history.setLoanOfficerId(command.getLoanOfficerId());
        history.setOfficerName(command.getOfficerName().trim());
        history.setApplicationId(command.getApplicationId());
        history.setAction(CREDIT_HISTORY_VIEWED);

        CreditScoreHistory savedHistory = creditScoreHistoryRepository.save(history);

        return mapToCreditScoreQuery(creditScore, savedHistory);
    }

    // Finds requested applications that already have a credit-view audit row.
    public List<Long> getViewedApplicationIds(Collection<Long> applicationIds) {
        List<Long> validApplicationIds = applicationIds == null
                ? List.of()
                : applicationIds.stream()
                        .filter(id -> id != null && id > 0)
                        .distinct()
                        .toList();

        if (validApplicationIds.isEmpty()) {
            return List.of();
        }

        return creditScoreHistoryRepository
                .findViewedApplicationIds(validApplicationIds);
    }

    @Override
    // Returns all known credit-score records.
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
    // Retrieves a score by normalized PAN number.
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

    // Maps a score to the privacy-safe response representation.
    private CreditScoreQuery mapToCreditScoreQuery(
            CreditScore creditScore) {

        return mapToCreditScoreQuery(creditScore, null);
    }

    // Maps a score and optional retrieval audit row to the API response.
    private CreditScoreQuery mapToCreditScoreQuery(
            CreditScore creditScore,
            CreditScoreHistory history) {

        CreditScoreQuery query = new CreditScoreQuery();

        query.setMaskedPanNumber(maskPanNumber(creditScore.getPanNumber()));
        query.setScore(creditScore.getScore());
        query.setCheckedAt(creditScore.getCheckedAt());
        query.setGeneratedAt(creditScore.getCheckedAt());
        query.setBand(getBand(creditScore.getScore()));
        query.setRepaymentSummary(getRepaymentSummary(creditScore.getScore()));

        if (history != null) {
            query.setRetrievedAt(history.getCheckedAt());
            query.setAction(history.getAction());
        }

        return query;
    }

    // Masks the middle digits of a PAN before exposing it to callers.
    private String maskPanNumber(String panNumber) {
        if (panNumber == null || panNumber.length() < 6) {
            return "****";
        }
        return panNumber.substring(0, 5) + "****"
                + panNumber.substring(panNumber.length() - 1);
    }

    // Maps numeric scores to the UI's risk-band label.
    private String getBand(Integer score) {
        if (score >= 740) return "Excellent";
        if (score >= 670) return "Good";
        if (score >= 580) return "Fair";
        return "Poor";
    }

    // Supplies a mock repayment summary appropriate for the score band.
    private String getRepaymentSummary(Integer score) {
        return switch (getBand(score)) {
            case "Excellent" ->
                    "Mock profile: recent repayments are on time with no recorded delinquencies.";
            case "Good" ->
                    "Mock profile: repayments are generally on time with isolated minor delays.";
            case "Fair" ->
                    "Mock profile: some delayed repayments are present; review affordability carefully.";
            default ->
                    "Mock profile: repeated repayment delays indicate enhanced review is advisable.";
        };
    }

    // Returns an existing score or deterministically provisions a new one.
    private CreditScore getOrCreateCreditScore(String panNumber) {
        return creditScoreRepository
                .findById(panNumber)
                .orElseGet(() -> {
                    CreditScore creditScore = new CreditScore();
                    creditScore.setPanNumber(panNumber);
                    creditScore.setScore(
                            mockCreditScoreGenerator.generateScore(panNumber)
                    );
                    return creditScoreRepository.save(creditScore);
                });
    }

    // Normalizes PAN input before repository access.
    private String normalizePanNumber(String panNumber) {
        return panNumber.trim().toUpperCase(Locale.ROOT);
    }
}
