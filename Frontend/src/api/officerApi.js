import { apiRequest } from "./client";

export const getOfficerApplications = () => apiRequest("/api/loan-officer/applications");
export const getOfficerApplicationById = (applicationId) => apiRequest(`/api/loan-officer/applications/${applicationId}`);
export const approveApplication = (applicationId, payload) => apiRequest(`/api/loan-officer/applications/${applicationId}/approve`, { 
    method: "PUT", 
    body: JSON.stringify(payload) 
});
export const rejectApplication = (applicationId, payload) => apiRequest(`/api/loan-officer/applications/${applicationId}/reject`, { 
    method: "PUT", 
    body: JSON.stringify(payload) 
});
export const getPanCardImage = (applicationId) => apiRequest(`/api/loan-officer/applications/${applicationId}/pan-card-image`, {
    responseType: "blob"
});
