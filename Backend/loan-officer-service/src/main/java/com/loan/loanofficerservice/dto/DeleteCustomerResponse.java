package com.loan.loanofficerservice.dto;

public record DeleteCustomerResponse(
        String message,
        Long customerId
) {
}