package com.loanmanagement.loantype.service;

import com.loanmanagement.loantype.dto.LoanTypeResponse;
import com.loanmanagement.loantype.entity.LoanType;
import com.loanmanagement.loantype.exception.LoanTypeNotFoundException;
import com.loanmanagement.loantype.repository.LoanTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoanTypeServiceTest {

    @Mock
    private LoanTypeRepository loanTypeRepository;

    @InjectMocks
    private LoanTypeService loanTypeService;

    @Test
    void shouldReturnAllLoanTypes() {
        LoanType loanType = createLoanType();

        when(loanTypeRepository.findAll()).thenReturn(List.of(loanType));

        List<LoanTypeResponse> result = loanTypeService.getAllLoanTypes();

        assertEquals(1, result.size());
        assertEquals("Home Loan", result.get(0).getLoanName());
        assertEquals(new BigDecimal("8.50"),
                result.get(0).getBaseInterestRate());
    }

    @Test
    void shouldReturnLoanTypeById() {
        LoanType loanType = createLoanType();

        when(loanTypeRepository.findById(1L))
                .thenReturn(Optional.of(loanType));

        LoanTypeResponse result = loanTypeService.getLoanTypeById(1L);

        assertEquals(1L, result.getLoanTypeId());
        assertEquals("Home Loan", result.getLoanName());
    }

    @Test
    void shouldThrowExceptionWhenLoanTypeDoesNotExist() {
        when(loanTypeRepository.findById(99L))
                .thenReturn(Optional.empty());

        LoanTypeNotFoundException exception = assertThrows(
                LoanTypeNotFoundException.class,
                () -> loanTypeService.getLoanTypeById(99L)
        );

        assertEquals("Loan type not found with id: 99",
                exception.getMessage());
    }

    @Test
    void shouldDeleteAndFlushExistingLoanType() {
        LoanType loanType = createLoanType();
        when(loanTypeRepository.findById(1L))
                .thenReturn(Optional.of(loanType));

        loanTypeService.deleteLoanType(1L);

        verify(loanTypeRepository).delete(loanType);
        verify(loanTypeRepository).flush();
    }

    private LoanType createLoanType() {
        LoanType loanType = new LoanType();
        loanType.setLoanTypeId(1L);
        loanType.setLoanName("Home Loan");
        loanType.setBaseInterestRate(new BigDecimal("8.50"));
        loanType.setMaximumTenureMonths(360);
        loanType.setDescription("Loan for purchasing a house.");
        loanType.setMaximumLoanAmount(new BigDecimal("10000000.00"));
        return loanType;
    }
}
