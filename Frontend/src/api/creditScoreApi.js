import { apiRequest } from "./client";

export const getCreditScore = (panNumber) => apiRequest(`/api/credit-scores/${encodeURIComponent(panNumber)}`);
