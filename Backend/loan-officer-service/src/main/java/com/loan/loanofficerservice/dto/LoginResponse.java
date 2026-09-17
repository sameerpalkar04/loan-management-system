package com.loan.loanofficerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tokenType;
    private Long loanOfficerId;
    private String officerName;
}
