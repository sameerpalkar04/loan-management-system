package com.loan.dao.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loan.dao.entity.LoanHistory;

public interface LoanHistoryRepo extends JpaRepository<LoanHistory, Long> {

    List<LoanHistory> findByApplicationIdIn(List<Long> applicationIds);
}