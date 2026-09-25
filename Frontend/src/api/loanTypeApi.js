import { apiRequest } from "./client";

// Loads the loan products visible to the current user.
export const getLoanTypes = () => apiRequest("/api/loan-types");
// Finds loan products by name.
export const searchLoanTypes = (name) => apiRequest(`/api/loan-types/search?name=${encodeURIComponent(name)}`);
// Loads one loan product by identifier.
export const getLoanTypeById = (loanTypeId) => apiRequest(`/api/loan-types/${loanTypeId}`);

// Keeps loan-product requests aligned with the backend contract.
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

// Creates a loan product from officer-entered values.
export const createLoanType = (loanType) => apiRequest("/api/loan-types", {
  method: "POST",
  body: JSON.stringify(loanTypePayload(loanType)),
});
// Persists edits to an existing loan product.
export const updateLoanType = (loanTypeId, loanType) => apiRequest(`/api/loan-types/${loanTypeId}`, {
  method: "PUT",
  body: JSON.stringify(loanTypePayload(loanType)),
});
// Deletes a loan product by identifier.
export const deleteLoanType = (loanTypeId) => apiRequest(`/api/loan-types/${loanTypeId}`, { 
  method: "DELETE" 
});
