package com.loan.loanofficerservice.dto;

import com.loan.loanofficerservice.dao.entity.LoanOfficer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class LoanOfficerPrincipal implements UserDetails {

    private final LoanOfficer loanOfficer;

    public LoanOfficerPrincipal(LoanOfficer loanOfficer) {
        this.loanOfficer = loanOfficer;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(
                new SimpleGrantedAuthority("ROLE_LOAN_OFFICER")
        );
    }

    @Override
    public String getPassword() {
        return loanOfficer.getOfficerPassword();
    }

    @Override
    public String getUsername() {
        return loanOfficer.getOfficerEmail();
    }

    public Long getOfficerId() {
        return loanOfficer.getLoanOfficerId();
    }

    public String getOfficerName() {
        return loanOfficer.getOfficerName();
    }
}