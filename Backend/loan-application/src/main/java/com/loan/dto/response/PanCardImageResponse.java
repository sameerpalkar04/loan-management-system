package com.loan.dto.response;

public record PanCardImageResponse(
        byte[] imageBytes,
        String contentType,
        String fileName
) {
}