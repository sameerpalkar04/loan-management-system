import { apiRequest } from "./client";

// Loads applications enriched for the loan-officer review queue.
export const getOfficerApplications = () => apiRequest("/api/loan-officer/applications");
// Loads a single officer-facing application record.
export const getOfficerApplicationById = (applicationId) => apiRequest(`/api/loan-officer/applications/${applicationId}`);
// Records an approval decision and approved loan terms.
export const approveApplication = (applicationId, payload) => apiRequest(`/api/loan-officer/applications/${applicationId}/approve`, { 
    method: "PUT", 
    body: JSON.stringify(payload) 
});
// Records a rejection decision and its customer-visible reason.
export const rejectApplication = (applicationId, payload) => apiRequest(`/api/loan-officer/applications/${applicationId}/reject`, { 
    method: "PUT", 
    body: JSON.stringify(payload) 
});
// Retrieves the submitted PAN-card image for an undecided application.
export const getPanCardImage = (applicationId) => apiRequest(`/api/loan-officer/applications/${applicationId}/pan-card-image`, {
    responseType: "blob"
});
