import { apiRequest } from "./client";
import { mockApplications, USE_MOCK_DATA, wait } from "./mockData";

const createMockApplication = (application) => {
  const loanType = Number(application.loanTypeId);
  const record = { applicationId: Date.now(), applicantName: "Priya Nair", panNumber: "BKLPN9023H", loanTypeId: loanType, loanTypeName: "Loan application", ...application, status: "PENDING", appliedAt: new Date().toISOString() };
  mockApplications.unshift(record);
  return wait(record);
};

export const createLoanApplication = (application, panCardImage) => {
  if (USE_MOCK_DATA) return createMockApplication(application);

  const formData = new FormData();
  formData.append("application", new Blob([JSON.stringify(application)], { type: "application/json" }));
  formData.append("panCardInage", panCardImage);

  return apiRequest("/api/v1/loan-applications", {
    method: "POST",
    body: formData,
  });
};

export const getMyApplications = () =>
  USE_MOCK_DATA ? wait([mockApplications[0]]) : apiRequest("/api/v1/loan-applications/me");

export const getAllApplications = () =>
  USE_MOCK_DATA ? wait(mockApplications) : apiRequest("/api/v1/loan-applications");

export const getPendingApplications = () =>
  USE_MOCK_DATA ? wait(mockApplications.filter((application) => application.status === "PENDING")) : apiRequest("/api/v1/loan-applications/pending");

export const getApplicationById = (applicationId) =>
  USE_MOCK_DATA ? wait(mockApplications.find((application) => application.applicationId === Number(applicationId))) : apiRequest(`/api/v1/loan-applications/${applicationId}`);

export const updateApplicationStatus = (applicationId, status) =>
  USE_MOCK_DATA ? wait({ applicationId: Number(applicationId), ...status }) : apiRequest(`/api/v1/loan-applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify(status),
  });

export const getApplicationPanCard = (applicationId) =>
  USE_MOCK_DATA ? wait(null) : apiRequest(`/api/v1/loan-applications/${applicationId}/pan-card-image`, { responseType: "blob" });
