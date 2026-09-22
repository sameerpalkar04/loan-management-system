import { apiRequest } from "./client";
import { mockScores, USE_MOCK_DATA, wait } from "./mockData";

export const getCreditScore = (panNumber) =>
  USE_MOCK_DATA ? wait({ panNumber, score: mockScores[panNumber.toUpperCase()] || 720, checkedAt: new Date().toISOString() }) : apiRequest(`/api/credit-scores/${encodeURIComponent(panNumber)}`);
