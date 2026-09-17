package com.loan.loanofficerservice.service.abstraction;

import com.loan.loanofficerservice.dto.LoanOfficerPrincipal;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface LoanOfficerDetailsService extends UserDetailsService {

    @Override
    LoanOfficerPrincipal loadUserByUsername(String officerEmail);
}
