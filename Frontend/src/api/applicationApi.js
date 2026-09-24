import { apiRequest } from "./client";

export const createLoanApplication = (application, panCardImage) => {
  const formData = new FormData();
  formData.append("application", new Blob([JSON.stringify(application)], { type: "application/json" }));
  formData.append("panCardImage", panCardImage);
  return apiRequest("/api/v1/loan-applications", { 
    method: "POST", 
    body: formData 
  });
};

export const calculateInterestRate = (request) =>
  apiRequest("/api/v1/loan-applications/calculate-interest-rate", {
    method: "POST",
    body: JSON.stringify(request),
  });

export const getMyApplications = () => apiRequest("/api/v1/loan-applications/me");
export const getAllApplications = () => apiRequest("/api/v1/loan-applications");
export const getPendingApplications = () => apiRequest("/api/v1/loan-applications/pending");
export const getApplicationById = (applicationId) => apiRequest(`/api/v1/loan-applications/${applicationId}`);
export const updateApplicationStatus = (applicationId, status) => apiRequest(`/api/v1/loan-applications/${applicationId}/status`, {
   method: "PATCH",
   body: JSON.stringify(status)
});
