import { apiRequest } from "./client";

// Submits a loan request and its PAN-card image as multipart data.
export const createLoanApplication = (application, panCardImage) => {
  const formData = new FormData();
  formData.append("application", new Blob([JSON.stringify(application)], { type: "application/json" }));
  formData.append("panCardImage", panCardImage);
  return apiRequest("/api/v1/loan-applications", { 
    method: "POST", 
    body: formData 
  });
};

// Requests the rate calculated for a proposed loan amount and tenure.
export const calculateInterestRate = (request) =>
  apiRequest("/api/v1/loan-applications/calculate-interest-rate", {
    method: "POST",
    body: JSON.stringify(request),
  });

// Loads the signed-in customer's application history.
export const getMyApplications = () => apiRequest("/api/v1/loan-applications/me");
// Loads every application for officer-facing workflows.
export const getAllApplications = () => apiRequest("/api/v1/loan-applications");
// Loads applications awaiting an officer decision.
export const getPendingApplications = () => apiRequest("/api/v1/loan-applications/pending");
// Loads one application by identifier.
export const getApplicationById = (applicationId) => apiRequest(`/api/v1/loan-applications/${applicationId}`);
// Updates an application's lifecycle status.
export const updateApplicationStatus = (applicationId, status) => apiRequest(`/api/v1/loan-applications/${applicationId}/status`, {
   method: "PATCH",
   body: JSON.stringify(status)
});
