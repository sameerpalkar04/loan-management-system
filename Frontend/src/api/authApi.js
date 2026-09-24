import { apiRequest } from "./client";

export const loginCustomer = (email, password) => apiRequest("/api/v1/auth/customers/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

export const loginOfficer = (email, password) => apiRequest("/api/v1/auth/officers/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
