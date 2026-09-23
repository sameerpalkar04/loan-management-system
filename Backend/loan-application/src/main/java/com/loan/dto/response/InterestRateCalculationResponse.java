package com.loan.dto.response;

import java.math.BigDecimal;

public record InterestRateCalculationResponse(
        BigDecimal interestRate
) {
}
