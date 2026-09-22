import { apiRequest } from "./client";
import { mockApplications, USE_MOCK_DATA, wait } from "./mockData";

const mockDecision = (applicationId, status, payload) => {
  const application = mockApplications.find((item) => item.applicationId === Number(applicationId));
  if (application) Object.assign(application, payload, { status, reviewedAt: new Date().toISOString() });
  return wait(application || { applicationId: Number(applicationId), status, ...payload });
};

export const getOfficerApplications = () =>
  USE_MOCK_DATA ? wait(mockApplications) : apiRequest("/api/loan-officer/applications");

export const getOfficerApplicationById = (applicationId) =>
  USE_MOCK_DATA ? wait(mockApplications.find((application) => application.applicationId === Number(applicationId))) : apiRequest(`/api/loan-officer/applications/${applicationId}`);

export const approveApplication = (applicationId, payload = {}) =>
  USE_MOCK_DATA ? mockDecision(applicationId, "APPROVED", payload) : apiRequest(`/api/loan-officer/applications/${applicationId}/approve`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const rejectApplication = (applicationId, payload) =>
  USE_MOCK_DATA ? mockDecision(applicationId, "REJECTED", payload) : apiRequest(`/api/loan-officer/applications/${applicationId}/reject`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getOfficerPanCard = (applicationId) =>
  USE_MOCK_DATA ? wait(null) : apiRequest(`/api/loan-officer/applications/${applicationId}/pan-card-image`, { responseType: "blob" });
