import { apiRequest } from "./client";

export const getLoanTypes = () => apiRequest("/api/loan-types");
export const searchLoanTypes = (name) => apiRequest(`/api/loan-types/search?name=${encodeURIComponent(name)}`);
export const getLoanTypeById = (loanTypeId) => apiRequest(`/api/loan-types/${loanTypeId}`);

const loanTypePayload = (loanType) => ({
  loanName: loanType.loanName,
  baseInterestRate: loanType.baseInterestRate,
  maximumTenureMonths: loanType.maximumTenureMonths,
  description: loanType.description,
  maximumLoanAmount: loanType.maximumLoanAmount,
  collateralRequired: loanType.collateralRequired,
  maximumLtvPercentage: loanType.collateralRequired
    ? loanType.maximumLtvPercentage
    : null,
});

export const createLoanType = (loanType) => apiRequest("/api/loan-types", {
  method: "POST",
  body: JSON.stringify(loanTypePayload(loanType)),
});
export const updateLoanType = (loanTypeId, loanType) => apiRequest(`/api/loan-types/${loanTypeId}`, {
  method: "PUT",
  body: JSON.stringify(loanTypePayload(loanType)),
});
export const deleteLoanType = (loanTypeId) => apiRequest(`/api/loan-types/${loanTypeId}`, { 
  method: "DELETE" 
});
