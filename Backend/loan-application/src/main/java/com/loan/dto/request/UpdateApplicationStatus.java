package com.loan.dto.request;

import com.loan.dao.entity.ApplicationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateApplicationStatus(

        @NotNull(message = "Application status is required")
        ApplicationStatus status,

        @Size(
                max = 500,
                message = "Decision reason cannot exceed 500 characters"
        )
        String decisionReason
) {
}