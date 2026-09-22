package com.loan.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.loan.dto.response.PanCardImageResponse;
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
<<<<<<< HEAD
=======
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Set;

>>>>>>> f99ff8d (Backup current loan management system)

@Service
@Transactional
public class LoanApplicationServiceImpl
        implements LoanApplicationServices {

    private final LoanApplicationRepo loanApplicationRepository;
    private final LoanHistoryRepo loanHistoryRepository;

    private static final long MAX_PAN_CARD_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

    private static final Set<String> ALLOWED_PAN_CARD_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png"
    );

    public LoanApplicationServiceImpl(
            LoanApplicationRepo loanApplicationRepository,
            LoanHistoryRepo loanHistoryRepository) {

        this.loanApplicationRepository = loanApplicationRepository;
        this.loanHistoryRepository = loanHistoryRepository;
    }

    @Override
    public LoanApplicationResponse createApplication(
            Long customerId,
            CreateLoanApplicationRequest request) {

        LoanApplication application = new LoanApplication();

        application.setCustomerId(customerId);
        application.setLoanTypeId(request.loanTypeId());
        application.setRequestedAmount(request.requestedAmount());
        application.setRequestedTenureMonths(
                request.requestedTenureMonths()
        );
        application.setValuation(request.valuation());
        application.setStatus(ApplicationStatus.PENDING);

        validatePanCardImage(panCardImage);

        try {
            application.setPanCardImage(panCardImage.getBytes());
        } catch (IOException exception) {
            throw new BusinessException("Unable to read PAN card image");
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

        LoanApplication savedApplication =
                loanApplicationRepository.save(application);

        // If approved, create loan history
        if (request.status() == ApplicationStatus.APPROVED) {
            createLoanHistory(savedApplication);
        }

        return toResponse(savedApplication);
    }

    private void createLoanHistory(
            LoanApplication application) {

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
                application.getRequestedAmount()
        );

        /*
         * Temporary development value.
         *
         * Replace this later with the actual
         * interest rate obtained from the
         * loan-catalog-service.
         */
        history.setAnnualInterestRate(
                new BigDecimal("10.00")
        );

        history.setTenureMonths(
                application.getRequestedTenureMonths()
        );

        history.setStatus(
                LoanAccountStatus.ACTIVE
        );

        loanHistoryRepository.save(history);
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

    private void validatePanCardImage(MultipartFile panCardImage) {

        if (panCardImage == null || panCardImage.isEmpty()) {
            throw new BusinessException("PAN card image is required");
        }

        if (panCardImage.getContentType() == null
                || !ALLOWED_PAN_CARD_IMAGE_TYPES.contains(
                panCardImage.getContentType())) {

            throw new BusinessException(
                    "PAN card image must be a JPG or PNG file"
            );
        }

        if (panCardImage.getSize() > MAX_PAN_CARD_IMAGE_SIZE) {
            throw new BusinessException(
                    "PAN card image must not exceed 5 MB"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PanCardImageResponse getPanCardImage(Long applicationId) {
        LoanApplication application = findApplication(applicationId);

        if (application.getPanCardImage() == null) {
            throw new ResourceNotFoundException(
                    "PAN-card image not found for application: " + applicationId
            );
        }

        return new PanCardImageResponse(
                application.getPanCardImage(),
                application.getPanCardImageContentType(),
                application.getPanCardImageFileName()
        );
    }
}
