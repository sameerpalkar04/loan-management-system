package com.loan.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.loan.dao.entity.ApplicationStatus;
import com.loan.dao.entity.LoanAccountStatus;
import com.loan.dao.entity.LoanApplication;
import com.loan.dao.entity.LoanHistory;
import com.loan.dao.repository.LoanApplicationRepo;
import com.loan.dao.repository.LoanHistoryRepo;
import com.loan.dto.request.CreateLoanApplicationRequest;
import com.loan.dto.request.UpdateApplicationStatus;
import com.loan.dto.response.LoanApplicationResponse;
import com.loan.exception.BusinessException;
import com.loan.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class LoanApplicationServiceImpl
        implements LoanApplicationServices {

    private final LoanApplicationRepo loanApplicationRepository;
    private final LoanHistoryRepo loanHistoryRepository;

    public LoanApplicationServiceImpl(
            LoanApplicationRepo loanApplicationRepository,
            LoanHistoryRepo loanHistoryRepository) {

        this.loanApplicationRepository = loanApplicationRepository;
        this.loanHistoryRepository = loanHistoryRepository;
    }

    @Override
    public LoanApplicationResponse createApplication(
            Long customerId,
            CreateLoanApplicationRequest request, MultipartFile panCardImage) {

        LoanApplication application = new LoanApplication();

        application.setCustomerId(customerId);
        application.setLoanTypeId(request.loanTypeId());
        application.setRequestedAmount(request.requestedAmount());
        application.setRequestedTenureMonths(
                request.requestedTenureMonths()
        );
        application.setValuation(request.valuation());
        application.setStatus(ApplicationStatus.PENDING);
        try {
            application.setPanCardImage(panCardImage.getBytes());
        } catch (IOException exception) {
            throw new BusinessException("Unable to read the PAN card image");
        }
        application.setPanCardImageContentType(panCardImage.getContentType());
        application.setPanCardImageFileName(panCardImage.getOriginalFilename());
        application.setPanCardImageSizeBytes(panCardImage.getSize());

        LoanApplication savedApplication =
                loanApplicationRepository.save(application);

        return toResponse(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public LoanApplicationResponse getApplicationById(
            Long applicationId) {

        return toResponse(findApplication(applicationId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanApplicationResponse> getCustomerApplications(
            Long customerId) {

        return loanApplicationRepository
                .findByCustomerIdOrderByAppliedAtDesc(customerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanApplicationResponse> getAllApplications() {

        return loanApplicationRepository
                .findAllByOrderByAppliedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoanApplicationResponse> getPendingApplications() {

        return loanApplicationRepository
                .findByStatusOrderByAppliedAtAsc(
                        ApplicationStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public LoanApplicationResponse updateApplicationStatus(
            Long officerId,
            Long applicationId,
            UpdateApplicationStatus request) {

        LoanApplication application =
                findApplication(applicationId);

        // Prevent changing a final decision
        if (application.getStatus() == ApplicationStatus.APPROVED
                || application.getStatus() == ApplicationStatus.REJECTED) {

            throw new BusinessException(
                    "A final decision has already been made for this application"
            );
        }

        // Only these statuses are allowed from the officer
        if (request.status() != ApplicationStatus.UNDER_REVIEW
                && request.status() != ApplicationStatus.APPROVED
                && request.status() != ApplicationStatus.REJECTED) {

            throw new BusinessException(
                    "Status must be UNDER_REVIEW, APPROVED, or REJECTED"
            );
        }

        // Update application
        application.setStatus(request.status());

        application.setReviewedByOfficerId(officerId);

        application.setReviewedAt(
                LocalDateTime.now()
        );

        application.setDecisionReason(
                request.decisionReason()
        );

        if (request.valuation() != null) {
            application.setValuation(request.valuation());
        }

        LoanApplication savedApplication =
                loanApplicationRepository.save(application);

        // If approved, create loan history
        if (request.status() == ApplicationStatus.APPROVED) {
            validateApprovalTerms(request);
            createLoanHistory(savedApplication, request);
        }

        return toResponse(savedApplication);
    }

    private void createLoanHistory(
            LoanApplication application,
            UpdateApplicationStatus request) {

        // Don't create duplicate loan history
        if (loanHistoryRepository.existsById(
                application.getApplicationId())) {

            return;
        }

        LoanHistory history = new LoanHistory();

        history.setApplicationId(
                application.getApplicationId()
        );

        history.setApprovedByOfficerId(
                application.getReviewedByOfficerId()
        );

        history.setLoanTypeId(
                application.getLoanTypeId()
        );

        history.setApprovedPrincipal(
                request.approvedPrincipal()
        );
        history.setAnnualInterestRate(
                request.annualInterestRate()
        );

        history.setTenureMonths(
                request.tenureMonths()
        );

        history.setStatus(
                LoanAccountStatus.ACTIVE
        );

        loanHistoryRepository.save(history);
    }

    private void validateApprovalTerms(UpdateApplicationStatus request) {

        if (request.approvedPrincipal() == null
                || request.annualInterestRate() == null
                || request.tenureMonths() == null) {

            throw new BusinessException(
                    "Approved principal, interest rate, and tenure are required for approval"
            );
        }
    }

    private LoanApplication findApplication(
            Long applicationId) {

        return loanApplicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Loan application not found: "
                                        + applicationId
                        )
                );
    }

    private LoanApplicationResponse toResponse(
            LoanApplication application) {

        return new LoanApplicationResponse(

                application.getApplicationId(),

                application.getCustomerId(),

                application.getLoanTypeId(),

                application.getReviewedByOfficerId(),

                application.getRequestedAmount(),

                application.getRequestedTenureMonths(),

                application.getValuation(),

                application.getStatus(),

                application.getAppliedAt(),

                application.getReviewedAt()
        );
    }
}
