package com.loan.loanofficerservice.service.implementation;

import com.loan.loanofficerservice.dao.entity.LoanOfficer;
import com.loan.loanofficerservice.dao.repository.LoanOfficerRepository;
import com.loan.loanofficerservice.dto.LoanOfficerPrincipal;
import com.loan.loanofficerservice.service.abstraction.LoanOfficerDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoanOfficerDetailsServiceImpl
        implements LoanOfficerDetailsService {

    private final LoanOfficerRepository loanOfficerRepository;

    @Override
    public LoanOfficerPrincipal loadUserByUsername(String officerEmail) {

        LoanOfficer loanOfficer = loanOfficerRepository
                .findByOfficerEmail(officerEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Loan officer not found"));

        return new LoanOfficerPrincipal(loanOfficer);
    }
}
