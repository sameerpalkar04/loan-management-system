import { apiRequest } from "./client";

// Registers a new customer profile.
export const registerCustomer = (customer) => apiRequest("/api/customers/register", {
  method: "POST",
  body: JSON.stringify(customer),
});

// Loads the authenticated customer's profile.
export const getCurrentCustomer = () => apiRequest("/api/customers/me");
