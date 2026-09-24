import { apiRequest } from "./client";

export const checkCreditScore = (payload) =>
  apiRequest("/api/credit-scores/check", {
    method: "POST",
    body: JSON.stringify(payload),
  });
