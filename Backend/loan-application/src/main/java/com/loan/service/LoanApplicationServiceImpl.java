package com.loan.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.loan.client.LoanTypeClient;
import com.loan.dto.response.LoanTypeLimitResponse;
import com.loan.dto.response.PanCardImageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.loan.dao.entity.ApplicationStatus;
import com.loan.dao.entity.LoanAccountStatus;
import com.loan.dao.entity.LoanApplication;
import com.loan.dao.entity.LoanHistory;
import com.loan.dao.repository.LoanApplicationRepo;
import com.loan.dao.repository.LoanHistoryRepo;
import com.loan.dto.request.CalculateInterestRateRequest;
import com.loan.dto.request.CreateLoanApplicationRequest;
import com.loan.dto.request.UpdateApplicationStatus;
import com.loan.dto.response.InterestRateCalculationResponse;
import com.loan.dto.response.LoanApplicationResponse;
import com.loan.exception.BusinessException;
import com.loan.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Set;


@Service
@Transactional
public class LoanApplicationServiceImpl
        implements LoanApplicationServices {

    private final LoanApplicationRepo loanApplicationRepository;
    private final LoanHistoryRepo loanHistoryRepository;
    private final LoanTypeClient loanTypeClient;

    private static final long MAX_PAN_CARD_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

    private static final BigDecimal MAX_TENURE_ADJUSTMENT =
            new BigDecimal("1.00");

    private static final BigDecimal RANDOM_VARIATION_LIMIT =
            new BigDecimal("0.25");

    private static final Set<String> ALLOWED_PAN_CARD_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png"
    );

    public LoanApplicationServiceImpl(
            LoanApplicationRepo loanApplicationRepository,
            LoanHistoryRepo loanHistoryRepository,
            LoanTypeClient loanTypeClient) {

        this.loanApplicationRepository = loanApplicationRepository;
        this.loanHistoryRepository = loanHistoryRepository;
        this.loanTypeClient = loanTypeClient;
    }

    @Override
    public LoanApplicationResponse createApplication(
            Long customerId,
            CreateLoanApplicationRequest request, MultipartFile panCardImage) {

        LoanTypeLimitResponse loanType =
                validateLoanTypeConstraints(request);

        LoanApplication application = new LoanApplication();

        application.setCustomerId(customerId);
        application.setLoanTypeId(request.loanTypeId());
        application.setRequestedAmount(request.requestedAmount());
        application.setRequestedTenureMonths(
                request.requestedTenureMonths()
        );
        application.setValuation(request.valuation());
        application.setInterestRate(
                generateInterestRate(
                        loanType,
                        request.requestedTenureMonths()
                )
        );
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

    private LoanTypeLimitResponse validateLoanTypeConstraints(
            CreateLoanApplicationRequest request) {

        LoanTypeLimitResponse loanType = loanTypeClient
                .getLoanTypeLimits(request.loanTypeId());

        if (loanType == null
                || loanType.baseInterestRate() == null
                || loanType.maximumLoanAmount() == null
                || loanType.maximumTenureMonths() == null
                || loanType.maximumTenureMonths() <= 0) {

            throw new BusinessException(
                    "Loan type limits are unavailable for loan type ID: "
                            + request.loanTypeId()
            );
        }

        if (request.requestedAmount()
                .compareTo(loanType.maximumLoanAmount()) > 0) {

            throw new BusinessException(
                    "Requested amount exceeds the maximum allowed amount of "
                            + loanType.maximumLoanAmount()
                            + " for " + loanType.loanName()
            );
        }

        validateTenure(
                loanType,
                request.requestedTenureMonths()
        );

        return loanType;
    }

    @Override
    @Transactional(readOnly = true)
    public InterestRateCalculationResponse calculateInterestRate(
            CalculateInterestRateRequest request) {

        LoanTypeLimitResponse loanType = loanTypeClient
                .getLoanTypeLimits(request.loanTypeId());

        validateLoanTypeForRateCalculation(loanType, request.loanTypeId());
        validateTenure(loanType, request.requestedTenureMonths());

        return new InterestRateCalculationResponse(
                generateInterestRate(
                        loanType,
                        request.requestedTenureMonths()
                )
        );
    }

    private void validateLoanTypeForRateCalculation(
            LoanTypeLimitResponse loanType,
            Long loanTypeId) {

        if (loanType == null
                || loanType.baseInterestRate() == null
                || loanType.maximumTenureMonths() == null
                || loanType.maximumTenureMonths() <= 0) {

            throw new BusinessException(
                    "Loan type rate details are unavailable for loan type ID: "
                            + loanTypeId
            );
        }
    }

    private void validateTenure(
            LoanTypeLimitResponse loanType,
            Integer tenureMonths) {

        if (tenureMonths > loanType.maximumTenureMonths()) {

            throw new BusinessException(
                    "Requested tenure of "
                            + tenureMonths
                            + " months exceeds the maximum allowed tenure of "
                            + loanType.maximumTenureMonths()
                            + " months for " + loanType.loanName()
            );
        }
    }

    private BigDecimal generateInterestRate(
            LoanTypeLimitResponse loanType,
            Integer tenureMonths) {

        BigDecimal tenureRatio = BigDecimal.valueOf(tenureMonths)
                .divide(
                        BigDecimal.valueOf(
                                loanType.maximumTenureMonths()
                        ),
                        4,
                        RoundingMode.HALF_UP
                );

        // Short tenure increases the rate; long tenure reduces it.
        BigDecimal tenureAdjustment = BigDecimal.valueOf(0.5)
                .subtract(tenureRatio)
                .multiply(MAX_TENURE_ADJUSTMENT)
                .multiply(BigDecimal.valueOf(2));

        BigDecimal randomAdjustment = BigDecimal.valueOf(
                ThreadLocalRandom.current().nextDouble(
                        RANDOM_VARIATION_LIMIT.negate().doubleValue(),
                        RANDOM_VARIATION_LIMIT.doubleValue()
                )
        );

        BigDecimal interestRate = loanType.baseInterestRate()
                .add(tenureAdjustment)
                .add(randomAdjustment);

        if (interestRate.compareTo(BigDecimal.ZERO) < 0) {
            interestRate = BigDecimal.ZERO;
        }

        return interestRate.setScale(2, RoundingMode.HALF_UP);
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

                application.getInterestRate(),

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
