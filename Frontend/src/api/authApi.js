import { apiRequest } from "./client";

// Authenticates a customer and returns the session token.
export const loginCustomer = (email, password) => apiRequest("/api/v1/auth/customers/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

// Authenticates a loan officer and returns the session token.
export const loginOfficer = (email, password) => apiRequest("/api/v1/auth/officers/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
