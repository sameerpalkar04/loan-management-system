package com.loan.creditscore.generators;

import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MockCreditScoreGenerator {

    public Integer generateScore(String panNumber) {

        String normalizedPan = panNumber
                .trim()
                .toUpperCase(Locale.ROOT);

        int hashValue = normalizedPan.hashCode();

        return 300 + Math.floorMod(hashValue, 601);
    }
}