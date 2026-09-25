import { apiRequest } from "./client";

// Retrieves and records a credit-score lookup for an application review.
export const checkCreditScore = (payload) =>
  apiRequest("/api/credit-scores/check", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Checks which supplied applications already have a recorded credit review.
export const getViewedCreditApplications = (applicationIds) =>
  apiRequest("/api/credit-scores/viewed-applications", {
    method: "POST",
    body: JSON.stringify(applicationIds),
  });
