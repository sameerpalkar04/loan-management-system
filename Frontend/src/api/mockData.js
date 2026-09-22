export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 350));

export const demoUsers = {
  customer: { email: "priya.nair@example.com", password: "Customer@123", role: "CUSTOMER", accessToken: "demo-customer-token" },
  officer: { email: "neha.kulkarni@luma.finance", password: "Officer@123", role: "LOAN_OFFICER", accessToken: "demo-officer-token" },
};

export const mockCustomerAccounts = [demoUsers.customer];

export const mockLoanTypes = [
  { loanTypeId: 1, loanName: "Home Loan", baseInterestRate: 8.45, maximumTenureMonths: 300, maximumLoanAmount: 12000000, description: "Buy, build, or refinance a place to call home." },
  { loanTypeId: 2, loanName: "Personal Loan", baseInterestRate: 13.75, maximumTenureMonths: 60, maximumLoanAmount: 2000000, description: "Flexible funds for planned moments and unexpected needs." },
  { loanTypeId: 3, loanName: "Vehicle Loan", baseInterestRate: 9.6, maximumTenureMonths: 84, maximumLoanAmount: 4000000, description: "Finance a new or pre-owned car or two-wheeler." },
  { loanTypeId: 4, loanName: "Education Loan", baseInterestRate: 10.25, maximumTenureMonths: 180, maximumLoanAmount: 7500000, description: "Support tuition and living costs for your next chapter." },
  { loanTypeId: 5, loanName: "Business Loan", baseInterestRate: 15.5, maximumTenureMonths: 60, maximumLoanAmount: 5000000, description: "Working capital designed for growing businesses." },
  { loanTypeId: 6, loanName: "Gold Loan", baseInterestRate: 11.9, maximumTenureMonths: 36, maximumLoanAmount: 1500000, description: "Quick funding backed by your gold assets." },
];

export const mockApplications = [
  { applicationId: 1024, applicantName: "Priya Nair", panNumber: "BKLPN9023H", loanTypeId: 2, loanTypeName: "Personal Loan", requestedAmount: 900000, requestedTenureMonths: 48, valuation: 1000000, status: "PENDING", appliedAt: "2026-09-21T09:30:00" },
  { applicationId: 1025, applicantName: "Rohan Desai", panNumber: "AFZPM4471K", loanTypeId: 5, loanTypeName: "Business Loan", requestedAmount: 1500000, requestedTenureMonths: 36, valuation: 1850000, status: "PENDING", appliedAt: "2026-09-20T13:10:00" },
  { applicationId: 1026, applicantName: "Aarav Mehta", panNumber: "DNTPO5529L", loanTypeId: 1, loanTypeName: "Home Loan", requestedAmount: 6800000, requestedTenureMonths: 240, valuation: 9200000, status: "APPROVED", appliedAt: "2026-09-18T10:15:00" },
];

export const mockScores = { BKLPN9023H: 694, AFZPM4471K: 611, DNTPO5529L: 782 };
