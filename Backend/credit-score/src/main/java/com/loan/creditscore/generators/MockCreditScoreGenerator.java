package com.loan.creditscore.generators;

import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
// Produces repeatable mock credit scores from normalized PAN numbers.
public class MockCreditScoreGenerator {

    // Maps a PAN hash into the standard 300–900 credit-score range.
    public Integer generateScore(String panNumber) {

        String normalizedPan = panNumber
                .trim()
                .toUpperCase(Locale.ROOT);

        int hashValue = normalizedPan.hashCode();

        return 300 + Math.floorMod(hashValue, 601);
    }
}
