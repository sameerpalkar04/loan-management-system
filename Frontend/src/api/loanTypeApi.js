import { apiRequest } from "./client";
import { mockLoanTypes, USE_MOCK_DATA, wait } from "./mockData";

const mockUpdateLoanType = (loanTypeId, loanType) => {
  const index = mockLoanTypes.findIndex((item) => item.loanTypeId === Number(loanTypeId));
  const updated = { ...mockLoanTypes[index], ...loanType, loanTypeId: Number(loanTypeId) };
  if (index >= 0) mockLoanTypes[index] = updated;
  return wait(updated);
};

export const getLoanTypes = () => USE_MOCK_DATA ? wait(mockLoanTypes) : apiRequest("/api/loan-types");

export const searchLoanTypes = (name) =>
  USE_MOCK_DATA ? wait(mockLoanTypes.filter((loan) => loan.loanName.toLowerCase().includes(name.toLowerCase()))) : apiRequest(`/api/loan-types/search?name=${encodeURIComponent(name)}`);

export const getLoanTypeById = (loanTypeId) =>
  USE_MOCK_DATA ? wait(mockLoanTypes.find((loan) => loan.loanTypeId === Number(loanTypeId))) : apiRequest(`/api/loan-types/${loanTypeId}`);

export const createLoanType = (loanType) =>
  USE_MOCK_DATA ? wait({ loanTypeId: Date.now(), ...loanType }) : apiRequest("/api/loan-types", {
    method: "POST",
    body: JSON.stringify(loanType),
  });

export const updateLoanType = (loanTypeId, loanType) =>
  USE_MOCK_DATA ? mockUpdateLoanType(loanTypeId, loanType) : apiRequest(`/api/loan-types/${loanTypeId}`, {
    method: "PUT",
    body: JSON.stringify({
      loanName: loanType.loanName,
      baseInterestRate: loanType.baseInterestRate,
      maximumTenureMonths: loanType.maximumTenureMonths,
      description: loanType.description,
      maximumLoanAmount: loanType.maximumLoanAmount,
    }),
  });

export const deleteLoanType = (loanTypeId) =>
  USE_MOCK_DATA ? wait(null) : apiRequest(`/api/loan-types/${loanTypeId}`, {
    method: "DELETE",
  });
