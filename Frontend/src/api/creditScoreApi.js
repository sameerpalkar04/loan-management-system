import { apiRequest } from "./client";

export const checkCreditScore = (payload) =>
  apiRequest("/api/credit-scores/check", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getViewedCreditApplications = (applicationIds) =>
  apiRequest("/api/credit-scores/viewed-applications", {
    method: "POST",
    body: JSON.stringify(applicationIds),
  });
